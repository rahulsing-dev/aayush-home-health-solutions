const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** "2020-06-20" -> "20 June 2020" (timezone-stable). */
export const formatDate = (d: Date) => dateFmt.format(d);
export const toISODate = (d: Date) => d.toISOString().slice(0, 10);
