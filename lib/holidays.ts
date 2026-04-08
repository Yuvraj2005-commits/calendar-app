export async function getHolidays(year: number) {
  try {
    const res = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/GB`
    );

 
    if (!res.ok) {
      console.error("API ERROR:", res.status);
      return [];
    }

   
    const text = await res.text();

    if (!text) {
      console.error("Empty response");
      return [];
    }

    const data = JSON.parse(text);

    return data.map((h: any) => ({
      name: h.localName,
      date: { iso: h.date },
    }));

  } catch (err) {
    console.error("FETCH ERROR:", err);
    return [];
  }
}