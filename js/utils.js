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