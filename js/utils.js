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

  if(logoImg && logoImg.complete && logoImg.src){
    try {
      pdf.addImage(logoImg, "PNG", pageWidth / 2 - 15, 10, 30, 30)
    } catch(e) {
      console.log("Logo could not be added to PDF:", e)
    }
  }
}

/* ADD LOGO TO PDF - ASYNC VERSION */
async function addLogoPDFAsync(pdf, pageWidth) {
  return new Promise((resolve) => {
    const logoImg = document.getElementById("headerLogo")

    if(!logoImg || !logoImg.src){
      resolve()
      return
    }

    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = function() {
      try {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        ctx.drawImage(img, 0, 0)
        const imgData = canvas.toDataURL("image/png")
        pdf.addImage(imgData, "PNG", pageWidth / 2 - 15, 10, 30, 30)
      } catch(e) {
        console.log("Logo could not be added to PDF:", e)
      }
      resolve()
    }

    img.onerror = function() {
      console.log("Failed to load logo image")
      resolve()
    }

    img.src = logoImg.src
  })
}
