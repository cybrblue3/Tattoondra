import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarView.css'; // Custom minimal styling
import { Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Manual Spanish locale setup
moment.updateLocale('es', {
  months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
  monthsShort: 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_'),
  weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
  weekdaysShort: 'dom_lun_mar_mié_jue_vie_sáb'.split('_'),
  weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
});

moment.locale('es');
const localizer = momentLocalizer(moment);

// Status color mapping (same as Appointments.jsx)
const getStatusColor = (status) => {
  switch(status) {
    case 'CONFIRMED': return '#2196f3'; // Blue
    case 'COMPLETED': return '#4caf50'; // Green
    case 'CANCELLED': return '#f44336'; // Red
    case 'NO_SHOW': return '#ff9800'; // Orange
    case 'PENDING_CONFIRMATION': return '#9e9e9e'; // Gray
    default: return '#9e9e9e';
  }
};

function CalendarView({ appointments }) {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');

  // Transform appointments into calendar events
  const events = appointments.map(appointment => ({
    id: appointment.id,
    title: `${appointment.client.name} - ${appointment.description || 'Cita'}`,
    start: new Date(appointment.date),
    end: new Date(new Date(appointment.date).getTime() + appointment.duration * 60000), // duration in minutes
    resource: appointment, // Store full appointment data
    status: appointment.status
  }));

  // Debug: Log events to check status
  console.log('Calendar events:', events);

  // Custom event styling based on status
  const eventStyleGetter = (event) => {
    const backgroundColor = getStatusColor(event.status);
    console.log('Event:', event.title, 'Status:', event.status, 'Color:', backgroundColor);
    return {
      style: {
        backgroundColor: backgroundColor,
        borderRadius: '5px',
        opacity: 0.9,
        color: 'white',
        border: `3px solid ${backgroundColor}`,
        display: 'block',
        fontWeight: 'bold',
        fontSize: '0.85rem'
      }
    };
  };

  // Handle clicking on an event
  const handleSelectEvent = (event) => {
    navigate(`/dashboard/appointments/${event.id}`);
  };

  // Spanish messages for calendar
  const messages = {
    allDay: 'Todo el día',
    previous: 'Anterior',
    next: 'Siguiente',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'No hay citas en este rango de fechas',
    showMore: (total) => `+ Ver más (${total})`
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ height: 600 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          messages={messages}
          views={['month', 'week', 'day', 'agenda']}
          view={view}
          date={date}
          onView={(newView) => setView(newView)}
          onNavigate={(newDate) => setDate(newDate)}
        />
      </Box>
    </Paper>
  );
}

export default CalendarView;
