import express from "express"
import { engine } from "express-handlebars"
const PORT = process.env.PORT || 3000
// import { database } from "./in-memory-database.js"
import { database } from "./persistent-database.js"

// import multer from "multer"
import multer from "multer"
const upload = multer({ dest: "uploads/" })

const app = express()
app.engine("hbs", engine({ extname: ".hbs" }))

app.set("view engine", "hbs")
app.set("views", "views")

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))

app.get("/", async (req, res) => {
  res.render("home", {
    subscribers: await database.getsubscribers(),
  })
})

app.get("/subscribe", async (req, res) => {
  res.render("subscribe", {
    subscribers: await database.getsubscribers(),
  })
})

// update the create route for file upload with "avatar" input
app.post("/subscribers/create", upload.single("avatar"), async (req, res) => {
  const subscriberData = {
    ...req.body,
    file: req.file ? req.file.filename : null,
  }
  await database.addSubscriber(subscriberData)
  res.redirect("/")
})

app.post("/subscribers/delete/:id", async (req, res) => {
  await database.removeSubscriber(req.params.id)
  res.redirect("/")
})

app.post("/subscribers/favorite/:id", async (req, res) => {
  await database.favoriteSubscriber(req.params.id)
  res.redirect("/")
})

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})
