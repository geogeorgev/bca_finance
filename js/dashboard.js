async function treasurerDashboard(){

const currentYear = new Date().getFullYear()

// Get all income and expense data
const incomeSnap = await db.collection("income").get()
const expenseSnap = await db.collection("expense").get()
const budgetSnap = await db.collection("budget").get()

let monthlyIncome = {}
let monthlyExpense = {}
let ytdIncome = 0
let ytdExpense = 0

// Process income data
/*incomeSnap.forEach(doc=>{
  const d = doc.data()
  const date = new Date(d.CollectionDate.seconds*1000)
  const year = date.getFullYear()

  // Calculate YTD
  if(year === currentYear){
    ytdIncome += d.Amount
  }

  const key = year + "-" + String(date.getMonth()+1).padStart(2, '0')
  monthlyIncome[key] = (monthlyIncome[key] || 0) + d.Amount
})
*/

expenseSnap.forEach(doc => {

  const d = doc.data()

  if(!d.PaymentDate) return

  let date

  if(d.PaymentDate.seconds){
    const date = new Date(d.CollectionDate)
  }
  else{
    date = new Date(d.PaymentDate)
  }

  if(!d.CollectionDate) return
  const date = new Date(d.CollectionDate)

  const year = date.getFullYear()

  if(year === currentYear){
    ytdExpense += Number(d.Amount || 0)
  }

  const key = year + "-" + String(date.getMonth()+1).padStart(2,'0')

  monthlyExpense[key] = (monthlyExpense[key] || 0) + Number(d.Amount || 0)

})


// Process expense data
expenseSnap.forEach(doc=>{
  const d = doc.data()
  const date = new Date(d.PaymentDate.seconds*1000)
  const year = date.getFullYear()

  // Calculate YTD
  if(year === currentYear){
    ytdExpense += d.Amount
  }

  const key = year + "-" + String(date.getMonth()+1).padStart(2, '0')
  monthlyExpense[key] = (monthlyExpense[key] || 0) + d.Amount
})

// Get budget totals
let totalBudget = 0
let totalSpent = 0
budgetSnap.forEach(doc=>{
  const b = doc.data()
  totalBudget += b.BudgetAmount || 0
  totalSpent += b.Spent || 0
})

const ytdBalance = ytdIncome - ytdExpense

// Create dashboard HTML
let html = `
<style>
  .dashboard-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .summary-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    text-align: center;
  }

  .summary-card.income {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  }

  .summary-card.expense {
    background: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%);
  }

  .summary-card.balance {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .summary-card h3 {
    margin: 0 0 10px 0;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.9;
  }

  .summary-card .amount {
    font-size: 32px;
    font-weight: bold;
    margin: 10px 0;
  }

  .summary-card .year {
    font-size: 12px;
    opacity: 0.8;
  }

  .charts-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 30px;
    margin-bottom: 30px;
  }

  .chart-card {
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .chart-card h3 {
    margin-top: 0;
    color: #333;
    border-bottom: 3px solid #667eea;
    padding-bottom: 12px;
  }
</style>

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
  <h2 style="margin: 0;">Treasurer Dashboard</h2>
  <p style="margin: 5px 0 0 0; opacity: 0.9;">Year ${currentYear} Financial Overview</p>
</div>

<div class="dashboard-container">

  <div class="summary-card income">
    <h3>YTD Collection</h3>
    <div class="amount">$${ytdIncome.toFixed(2)}</div>
    <div class="year">Year to Date</div>
  </div>

  <div class="summary-card expense">
    <h3>YTD Expense</h3>
    <div class="amount">$${ytdExpense.toFixed(2)}</div>
    <div class="year">Year to Date</div>
  </div>

  <div class="summary-card balance">
    <h3>YTD Balance</h3>
    <div class="amount">$${ytdBalance.toFixed(2)}</div>
    <div class="year">${ytdBalance >= 0 ? 'Surplus' : 'Deficit'}</div>
  </div>

</div>

<div class="charts-container">
  <div class="chart-card">
    <h3>Monthly Collection vs Expense</h3>
    <canvas id="monthlyChart" height="80"></canvas>
  </div>

  <div class="chart-card">
    <h3>Budget vs Actual Spending</h3>
    <canvas id="budgetChart" height="80"></canvas>
  </div>
</div>
`

show(html)

// Draw monthly trend chart
await drawMonthlyChart(monthlyIncome, monthlyExpense, currentYear)

// Draw budget vs actual chart
drawBudgetVsActualChart(budgetSnap)

}

/* DRAW MONTHLY TREND CHART */
async function drawMonthlyChart(monthlyIncome, monthlyExpense, year){

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const incomeData = []
const expenseData = []

for(let i = 1; i <= 12; i++){
  const key = year + "-" + String(i).padStart(2, '0')
  incomeData.push(monthlyIncome[key] || 0)
  expenseData.push(monthlyExpense[key] || 0)
}

const ctx = document.getElementById("monthlyChart")

new Chart(ctx, {
  type: 'line',
  data: {
    labels: monthNames,
    datasets: [
      {
        label: 'Collection',
        data: incomeData,
        borderColor: '#38ef7d',
        backgroundColor: 'rgba(56, 239, 125, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#38ef7d',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      },
      {
        label: 'Expense',
        data: expenseData,
        borderColor: '#ff6a00',
        backgroundColor: 'rgba(255, 106, 0, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#ff6a00',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 12 },
          padding: 15
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(0)
          }
        }
      }
    }
  }
})

}

/* DRAW BUDGET VS ACTUAL CHART */
async function drawBudgetVsActualChart(budgetSnap){

let labels = []
let budgetData = []
let spentData = []

budgetSnap.forEach(doc=>{
  const b = doc.data()
  labels.push(b.Category + " - " + b.SubCategory)
  budgetData.push(b.BudgetAmount || 0)
  spentData.push(b.Spent || 0)
})

const ctx = document.getElementById("budgetChart")

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: labels,
    datasets: [
      {
        label: 'Budget',
        data: budgetData,
        backgroundColor: '#667eea',
        borderRadius: 6
      },
      {
        label: 'Spent',
        data: spentData,
        backgroundColor: '#ff6a00',
        borderRadius: 6
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 12 },
          padding: 15
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(0)
          }
        }
      },
      x: {
        ticks: {
          font: { size: 10 }
        }
      }
    }
  }
})

}

