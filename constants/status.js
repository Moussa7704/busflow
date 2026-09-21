const tripStatus = {
    SCHEDULED: "SCHEDULED",
    BOARDING: "BOARDING",
    DEPARTED: "DEPARTED",
    ARRIVED: "ARRIVED",
    CANCELLED: "CANCELLED"
}

const bookingStatus = {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    CANCELLED: "CANCELLED",
    COMPLETED: "COMPLETED"
}

const ticketStatus = {
    ACTIVE: "ACTIVE",
    USED: "USED",
    CANCELLED: "CANCELLED"
}

const paymentMethod = {
    ATTEMPTED: "ATTEMPTED",
    CASH: "CASH",
    MOBILE_MONEY: "MOBILE_MONEY",
    CARD: "CARD"
}

const courrierStatus = {
    REGISTERED: "REGISTERED",
    IN_TRANSIT: "IN_TRANSIT",
    ARRIVED: "ARRIVED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED"
}

const busStatus = {
    AVAILABLE: "AVAILABLE",
    MAINTENANCE: "MAINTENANCE",
    OUT_OF_SERVICE: "OUT_OF_SERVICE"
}

module.exports = {
    tripStatus,
    bookingStatus,
    ticketStatus,
    paymentMethod,
    courrierStatus,
    busStatus
}