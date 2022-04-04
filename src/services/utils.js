export {
    getDateInStrFormat
  };
  
  /* Formatting date */
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu","Fri", "Sat"];
  
  function getDateInStrFormat(date){
    var strformatted = dayNames[date.getDay()]+", "+
                       date.getDate()+" "+
                       monthNames[date.getMonth()]+" "+
                       date.getFullYear()
    return strformatted;
  }
  /* End formatting date */