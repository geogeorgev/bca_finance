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

/* ADD LOGO TO PDF */
function addLogoPDF(pdf, pageWidth) {
  const logoImg = document.getElementById("headerLogo")

  if(logoImg && logoImg.src){
    try {
      // Create a canvas to convert the image
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = function() {
        ctx.drawImage(img, 0, 0)
        const imgData = canvas.toDataURL("image/png")
        // Add image to PDF (positioned at top)
        pdf.addImage(imgData, "PNG", pageWidth / 2 - 15, 10, 30, 30)
      }

      img.src = logoImg.src
    } catch(e) {
      console.log("Logo image could not be added to PDF")
    }
  }
}
