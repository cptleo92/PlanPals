import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const accordionSummaryStyle = {
  fontWeight: 500
}

const accordionDetailsStyle = {
  color: 'text.secondary',
}

const LandingPageAccordion = () => {
  return (
    <Container maxWidth="md">
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography sx={accordionSummaryStyle}>What does PlanPals do to make event planning simple?</Typography>
        </AccordionSummary>
        <AccordionDetails sx={accordionDetailsStyle}>
          <Typography>
            When planning a "hangout", there is no date set in stone at the time of creation. Instead,
            PlanPals allows the planner to suggest a handful of dates as options. Users can vote on these options,
            and it's up to the planner to eventually select a single date, finalizing the hangout. Afterwards, users
            are still free to join in or leave depending on their availabilities.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography sx={accordionSummaryStyle}>That sounds more complicated!</Typography>
        </AccordionSummary>
        <AccordionDetails sx={accordionDetailsStyle}>
          <Typography mb={3}>
            The problem PlanPals hopes to solve is a specific one.
            Let's say it's summer, and you want to hit the beach with your friends. You ask everyone if
            they're available and interested, but the conversations never result in anything concrete.
            And suddenly, the seasons change and you've missed your opportunity to enjoy a nice beach day.
          </Typography>
          <Typography>
          Making plans these days is difficult! Trying to maneuver around schedules, especially when more and
            more people are involved, can be extremely frustrating and puzzling. The goal of PlanPals is to
            ease that frustration by encouraging concrete details, proactive planning, and clear
            communication -- all on a simple, modern platform.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography sx={{ fontWeight: 500 }}>How do I search for groups to join?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={accordionDetailsStyle}>
            Currently, the only way to access a group's page is
            if you have the direct link to the group. PlanPals wants to
            help already existing circles manage outings and settle dates, and so
            there is no support at the moment for search functionality.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Container>
  )
}

export default LandingPageAccordion