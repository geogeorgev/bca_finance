function show(html){

document.getElementById("content").innerHTML = html

}

async function memberDropdown(){

const snap = await db.collection("members").get()

let html = `<select id="memberSelect">`

snap.forEach(doc=>{

const m = doc.data()

html += `<option value="${doc.id}">
${m.Name}
</option>`

})

html += "</select>"

return html

}