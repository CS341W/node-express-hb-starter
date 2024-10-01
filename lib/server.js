import express from "express"
import { engine } from "express-handlebars"
const PORT = process.env.PORT || 3000
// import { database } from "./in-memory-database.js"
import { database } from "./persistent-database.js"

const app = express()
app.engine("hbs", engine({ extname: ".hbs" }))

app.set("view engine", "hbs")
app.set("views", "views")

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))

app.get("/", async (request, response) => {
  response.render("home", {
    subscribers: await database.getsubscribers(),
  })
})

app.get("/subscribe", async (request, response) => {
  response.render("subscribe", {
    subscribers: await database.getsubscribers(),
  })
})

app.post("/subscribers/create", async (request, response) => {
  await database.addSubscriber(request.body)
  response.redirect("/")
})

app.post("/subscribers/delete/:id", async (request, response) => {
  await database.removeSubscriber(request.params.id)
  response.redirect("/")
})

app.post("/subscribers/favorite/:id", async (request, response) => {
  await database.favoriteSubscriber(request.params.id)
  response.redirect("/")
})

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})
