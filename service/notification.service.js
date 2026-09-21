const { sendBookingConfirmationEmail } = require("../utils/sendEmail");

const formatDate = (date) => {
    return new Date(date).toLocaleString("fr-FR", {
        dateStyle: "long",
        timeStyle: "short"
    });
};

class NotificationService {

    /**
     * Envoie l'email de confirmation avec le(s) ticket(s)/QR code au passager.
     * N'échoue jamais l'appelant : les erreurs d'envoi sont journalisées, pas propagées.
     */
    async sendBookingConfirmation({ passenger, trip, tickets }) {

        if (!passenger.email) {
            return { sent: false, reason: "Passager sans adresse email." };
        }

        if (!tickets || tickets.length === 0) {
            return { sent: false, reason: "Aucun ticket à notifier." };
        }

        try {

            const departureCity = trip.TripRoute ? trip.TripRoute.departure_city : "";
            const arrivalCity = trip.TripRoute ? trip.TripRoute.arrival_city : "";

            await sendBookingConfirmationEmail(passenger.email, {
                passengerName: `${passenger.first_name} ${passenger.last_name}`,
                compagnyName: trip.compagny ? trip.compagny.name : "BusFlow",
                departureCity,
                arrivalCity,
                departureTime: formatDate(trip.departure_time),
                arrivalTime: formatDate(trip.arrival_time),
                tickets: tickets.map(ticket => ({
                    ticket_number: ticket.ticket_number,
                    seat_number: ticket.seat_number,
                    booking_reference: ticket.booking_reference,
                    qr_code: ticket.qr_code
                }))
            });

            return { sent: true };

        } catch (error) {

            console.error(
                "[notification] Échec de l'envoi de l'email de confirmation :",
                error.message
            );

            return { sent: false, reason: error.message };

        }

    }

}

module.exports = new NotificationService();
