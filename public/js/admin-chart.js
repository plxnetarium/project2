const inventoryCanvas = document.getElementById("inventoryChart");

if (inventoryCanvas) {
  new Chart(inventoryCanvas, {
    type: "bar",
    data: {
      labels: ["In stock", "Out of stock"],
      datasets: [{
        data: [
          Number(inventoryCanvas.dataset.inStock),
          Number(inventoryCanvas.dataset.outOfStock)
        ],
        backgroundColor: ["#1455e8", "#dce2eb"]
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}
