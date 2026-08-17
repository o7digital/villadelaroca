module.exports = async function handler(request, response) {
  const { roomid, checkin, checkout } = request.query;
  if (!/^(658909|715668)$/.test(roomid || "") || !/^\d{4}-\d{2}-\d{2}$/.test(checkin || "") || !/^\d{4}-\d{2}-\d{2}$/.test(checkout || "")) {
    response.status(400).json({ error: "Invalid booking search" });
    return;
  }

  const params = new URLSearchParams({ ro: roomid, ci: checkin, co: checkout, na: "2", nc: "0", of: "1", nr: "1", la: "en", cu: "MXN" });
  const bookingResponse = await fetch(`https://beds24.com/api/ajax/getroomprice.php?${params}`, { method: "POST" });
  const [price] = await bookingResponse.json();
  const display = price?.roompricedisplay || "";
  const amounts = [...display.matchAll(/bookingpagedollars">([\d,]+)<\/span><span class="bookingpagecents">(\.\d+)/g)];

  if (!price || amounts.length < 2) {
    response.status(404).json({ error: "Price unavailable" });
    return;
  }

  response.setHeader("Cache-Control", "no-store");
  response.status(200).json({ usd: `${amounts[0][1]}${amounts[0][2]}`, mxn: `${amounts[1][1]}${amounts[1][2]}` });
};
