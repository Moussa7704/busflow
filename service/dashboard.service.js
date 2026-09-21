const { Op, fn, col } = require("sequelize");
const { Booking, Courrier, Bus, Trip } = require("../models");
const { bookingStatus, courrierStatus, busStatus, tripStatus } = require("../constants/status");

class DashboardService {

    async getSummary(filters = {}) {

        const { compagny_id } = filters;

        let since, until;

        if (filters.start_date && filters.end_date) {

            since = new Date(filters.start_date);
            since.setHours(0, 0, 0, 0);

            until = new Date(filters.end_date);
            until.setHours(23, 59, 59, 999);

        } else {

            const days = Number(filters.days) || 30;

            until = new Date();
            until.setHours(23, 59, 59, 999);

            since = new Date();
            since.setDate(since.getDate() - (days - 1));
            since.setHours(0, 0, 0, 0);

        }

        const dateRange = { [Op.between]: [since, until] };

        const bookingWhere = {};
        const courrierWhere = {};
        const busWhere = {};
        const tripWhere = {};

        if (compagny_id) {
            bookingWhere.compagny_id = compagny_id;
            courrierWhere.compagny_id = compagny_id;
            busWhere.compagny_id = compagny_id;
            tripWhere.compagny_id = compagny_id;
        }

        if (filters.trip_id) {
            bookingWhere.trip_id = filters.trip_id;
            courrierWhere.trip_id = filters.trip_id;
        }

        const [
            totalBookingRevenue,
            totalBookingsCount,
            totalCourrierRevenue,
            totalCourriersCount,
            bookingByDay,
            courrierByDay,
            courrierByStatus,
            totalBusesCount,
            maintenanceBusesCount,
            outOfServiceBusesCount,
            busyTrips
        ] = await Promise.all([

            Booking.sum("paid_amount", {
                where: { ...bookingWhere, status: { [Op.ne]: bookingStatus.CANCELLED }, createdAt: dateRange }
            }),

            Booking.count({
                where: { ...bookingWhere, status: { [Op.ne]: bookingStatus.CANCELLED }, createdAt: dateRange }
            }),

            Courrier.sum("paid_amount", {
                where: { ...courrierWhere, status: { [Op.ne]: courrierStatus.CANCELLED }, createdAt: dateRange }
            }),

            Courrier.count({
                where: { ...courrierWhere, status: { [Op.ne]: courrierStatus.CANCELLED }, createdAt: dateRange }
            }),

            Booking.findAll({
                attributes: [
                    [fn("DATE", col("createdAt")), "date"],
                    [fn("SUM", col("paid_amount")), "revenue"],
                    [fn("COUNT", col("id")), "count"]
                ],
                where: {
                    ...bookingWhere,
                    status: { [Op.ne]: bookingStatus.CANCELLED },
                    createdAt: dateRange
                },
                group: [fn("DATE", col("createdAt"))],
                order: [[fn("DATE", col("createdAt")), "ASC"]],
                raw: true
            }),

            Courrier.findAll({
                attributes: [
                    [fn("DATE", col("createdAt")), "date"],
                    [fn("SUM", col("paid_amount")), "revenue"],
                    [fn("COUNT", col("id")), "count"]
                ],
                where: {
                    ...courrierWhere,
                    status: { [Op.ne]: courrierStatus.CANCELLED },
                    createdAt: dateRange
                },
                group: [fn("DATE", col("createdAt"))],
                order: [[fn("DATE", col("createdAt")), "ASC"]],
                raw: true
            }),

            Courrier.findAll({
                attributes: [
                    "status",
                    [fn("COUNT", col("id")), "count"]
                ],
                where: { ...courrierWhere, createdAt: dateRange },
                group: ["status"],
                raw: true
            }),

            Bus.count({
                where: busWhere
            }),

            Bus.count({
                where: { ...busWhere, status: busStatus.MAINTENANCE }
            }),

            Bus.count({
                where: { ...busWhere, status: busStatus.OUT_OF_SERVICE }
            }),

            Trip.findAll({
                where: {
                    ...tripWhere,
                    status: {
                        [Op.notIn]: [tripStatus.CANCELLED, tripStatus.ARRIVED]
                    }
                },
                attributes: ["bus_id"],
                group: ["bus_id"],
                raw: true
            })

        ]);

        const inTripBusesCount = busyTrips.length;
        const availableBusesCount = Math.max(
            0,
            totalBusesCount - maintenanceBusesCount - outOfServiceBusesCount - inTripBusesCount
        );

        return {

            range: {
                start: since,
                end: until
            },

            kpis: {
                total_booking_revenue: Number(totalBookingRevenue) || 0,
                total_bookings: totalBookingsCount,
                total_courrier_revenue: Number(totalCourrierRevenue) || 0,
                total_courriers: totalCourriersCount
            },

            buses: {
                total: totalBusesCount,
                maintenance: maintenanceBusesCount,
                out_of_service: outOfServiceBusesCount,
                in_trip: inTripBusesCount,
                available: availableBusesCount
            },

            booking_by_day: bookingByDay.map((row) => ({
                date: row.date,
                revenue: Number(row.revenue) || 0,
                count: Number(row.count)
            })),

            courrier_by_day: courrierByDay.map((row) => ({
                date: row.date,
                revenue: Number(row.revenue) || 0,
                count: Number(row.count)
            })),

            courrier_by_status: courrierByStatus.map((row) => ({
                status: row.status,
                count: Number(row.count)
            }))

        };

    }

}

module.exports = new DashboardService();
