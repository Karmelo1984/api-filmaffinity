function getCurrentFormattedDate() {
    const currentDate = new Date();
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const currentMonth = monthNames[currentDate.getMonth()];
    const formattedDate = `${currentDate.getDate()}/${currentMonth}/${currentDate.getFullYear()} - ${currentDate.toLocaleTimeString('es-ES', { hour12: false })}`;
    return formattedDate;
}

module.exports = { getCurrentFormattedDate };