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

module.exports = {
    tripStatus,
    bookingStatus,
    ticketStatus
}