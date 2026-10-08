/* Installed in Beds24 > Property Booking Page > Developers > Advanced HTML. */
(function () {
  function update() {
    var nightsField = document.querySelector('input[name="numnight"]');
    var nights = nightsField && Number(nightsField.value);
    if (!Number.isInteger(nights) || nights < 1) return;
    var spanish = document.documentElement.lang.toLowerCase().indexOf('es') === 0 || new URLSearchParams(location.search).get('lang') === 'es';
    var locale = spanish ? 'es-MX' : 'en-US';
    document.querySelectorAll('[id^="x"][id$="drprice"]').forEach(function (amount) {
      var occupancyRow = amount.closest('.row');
      var panel = amount.closest('.panel-body');
      if (!occupancyRow || !panel) return;
      var raw = amount.textContent.replace(/[^\d.,-]/g, '');
      var decimal = raw.lastIndexOf(',') > raw.lastIndexOf('.') ? ',' : '.';
      var total = Number(raw.split(decimal).map(function (part, index, parts) {
        return part.replace(/[.,]/g, '') + (index === parts.length - 2 ? '.' : '');
      }).join(''));
      if (!Number.isFinite(total) || total < 0) return;
      var quantityField = panel.querySelector('input[name^="sr"]');
      var quantity = quantityField ? Number(quantityField.value) : 1;
      if (!Number.isInteger(quantity) || quantity < 1) quantity = 1;
      var key = 'vdr-nightly-' + amount.id;
      var row = document.getElementById(key);
      if (!row) {
        row = document.createElement('div');
        row.id = key;
        row.className = 'row';
        row.style.marginTop = '12px';
        row.style.marginBottom = '12px';
        var label = document.createElement('div');
        label.className = 'col-xs-12';
        row.appendChild(label);
        var calculation = document.createElement('div');
        calculation.className = 'col-xs-12';
        row.appendChild(calculation);
        occupancyRow.insertAdjacentElement('afterend', row);
      }
      var currencyNode = amount.parentElement.querySelector('.bookingpagecurrency');
      var currency = currencyNode ? currencyNode.textContent.trim() : '';
      var format = function (value) { return currency + ' ' + value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
      row.children[0].textContent = spanish ? 'Tarifa media por noche' : 'Average nightly rate';
      row.children[1].textContent = format(total / nights / quantity) + ' × ' + nights + (spanish ? (nights === 1 ? ' noche' : ' noches') : (nights === 1 ? ' night' : ' nights')) + (quantity > 1 ? ' × ' + quantity + (spanish ? ' alojamientos' : ' accommodations') : '') + ' = ' + format(total);
      row.children[1].style.fontWeight = '600';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', update);
  else update();
  // Beds24 recalculates the displayed amounts when the booking is edited.
  var scheduled = false;
  new MutationObserver(function (changes) {
    if (scheduled || !changes.some(function (change) {
      var node = change.target.nodeType === 1 ? change.target : change.target.parentElement;
      return node && !node.closest('[id^="vdr-nightly-"]');
    })) return;
    scheduled = true;
    setTimeout(function () { scheduled = false; update(); }, 0);
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
