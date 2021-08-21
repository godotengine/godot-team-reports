const READING_SPEED = 200;

// API Interaction
const ReportsAPI = {
  async get(path = '/') {
    const res = await fetch(`${path}`);
    if (res.status !== 200) {
      return null;
    }

    return await res.json();
  },

  async getData() {
    return await this.get("data.json");
  },
};

// Content helpers
const ReportsFormatter = {
  formatDate(dateString) {
    const options = {
      year: 'numeric', month: 'long', day: 'numeric'
    };
    const dateFormatter =  new Intl.DateTimeFormat('en-US', options);

    const date = new Date(dateString);
    return dateFormatter.format(date);
  },

  formatTimestamp(timeString) {
    const options = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', hour12: false, minute: 'numeric',
      timeZone: 'UTC', timeZoneName: 'short'
    };
    const dateFormatter =  new Intl.DateTimeFormat('en-US', options);

    const date = new Date(timeString);
    return dateFormatter.format(date);
  },

  getDaysSince(dateString) {
    const date = new Date(dateString);
    const msBetween = (new Date()) - date;
    const days = Math.floor(msBetween / (1000 * 60 * 60 * 24));

    return days;
  },

  formatDays(days) {
    return days + " " + (days !== 0 ? "days" : "day")
  },
};

const ReportsSingleton = {
  api: ReportsAPI,
  format: ReportsFormatter
};

window.greports = ReportsSingleton;