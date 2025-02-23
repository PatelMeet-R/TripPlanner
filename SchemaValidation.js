const { z } = require("zod");

module.exports.tripSchema = z.object({
  title: z.string().min(1),
  initialpoint: z.string().min(1),
  destination: z.object({
    country: z.string().min(1),
    location: z.string().min(1),
  }),

  startDate: z.preprocess(
    (val) => (val ? new Date(val) : val),
    z.date().refine((date) => date >= new Date()) // Check if the start date is in the future
  ),
  endDate: z.preprocess(
    (val) => (val ? new Date(val) : val), // Convert the input to a Date object if it's not null
    z.date().refine((endDate, ctx) => {
      const { startDate } = ctx.parent; // Access startDate
      return startDate ? endDate >= startDate : true; // Check if endDate is after startDate
    })
  ),

  description: z.string().optional(),
  budget: z.number().min(0).optional(),
  status: z.enum(["Planned", "OnTrip", "Delayed", "Complete"]).optional(),
});
