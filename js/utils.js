function show(html){

document.getElementById("content").innerHTML = html

}

async function getMembers(){

const snap = await db.collection("members").get()

let members = []

snap.forEach(doc=>{
members.push(doc.data())
})

return members

}

async function memberDropdown(){

const members = await getMembers()

let html = `<select id="memberSelect">`

members.forEach(m=>{
html += `<option value="${m.MemberID}">${m.MemberID} - ${m.Name}</option>`
})

html += `</select>`

return html

}

async function searchableMembers(){

const snap = await db.collection("members").get()

let list = `<input id="memberSearch" placeholder="Search member">`

list += `<select id="memberSelect">`

snap.forEach(doc=>{

const m=doc.data()

list += `<option value="${doc.id}">
${m.MemberID} - ${m.Name}
</option>`

})

list += "</select>"

return list

}