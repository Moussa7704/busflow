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

module.exports = {
    tripStatus,
    bookingStatus
}