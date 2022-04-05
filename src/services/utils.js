export {
    getDateInStrFormat,
    getDateForDeadline2,
    getDateForDeadline
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

  function getDateForDeadline(date){
    var strformatted = date.getFullYear() + "-" +
                       date.getMonth() + "-" +
                       date.getDate()
                       
                       
    return strformatted;
  }

  function getDateForDeadline2(date){
    const defaultValue = new Date(date).toISOString().split('T')[0];
    return defaultValue;
  }
  /* End formatting date */