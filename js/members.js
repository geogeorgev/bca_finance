async function loadMembers(){

show(`

<h2>Members</h2>

<input id="searchBox" placeholder="Search member" onkeyup="filterMembers()">

<div id="memberList"></div>

`)

const snap = await db.collection("members").orderBy("Name").get()

let html=""

snap.forEach(doc=>{

const m = doc.data()

html+=`
<div class="card memberRow">
${m.Name} - ${m.Phone}
</div>
`

})

document.getElementById("memberList").innerHTML=html

}

function filterMembers(){

const text=document.getElementById("searchBox").value.toLowerCase()

const rows=document.getElementsByClassName("memberRow")

for(let r of rows){

if(r.innerText.toLowerCase().includes(text))
r.style.display="block"
else
r.style.display="none"

}

}