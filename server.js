import express from "express"
import cors from "cors"
import mongoose from "mongoose";
import nodemailer from 'nodemailer'


//nodemailer
const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "bansall619@gmail.com",
        pass: "lnvl akds lxwm sndk",
    },
});

//mongo db
const connectDb = async () => {
    await mongoose.connect('mongodb+srv://bansall619:9bz847BY84ufELiM@cluster0.drxfjli.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => console.log("DB Connected"))
}

//contact Scema
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    }
}, { minimize: false })

//Contact Model
const contactModel = mongoose.models.contact || mongoose.model("contact", contactSchema);

//contact function
const contact = async (req, res) => {
    const { name, email, message } = req.body;
    try {
        const newContact = new contactModel({
            name: name,
            email: email,
            message: message
        })
        const contact = await newContact.save()
        res.json({ success: true, message: "Thank You for Contact Us." })
        //nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: "bansall619@gmail.com",
                pass: "lnvl akds lxwm sndk",
            },
        });
        const info = await transporter.sendMail({
            from: "bansall619@gmail.com", // sender address
            to: email, // list of receivers
            subject: "Contact", // Subject line
            text: "Thank Your " +name+ " For Contact us, we will contact you as soon as possible", // plain text body
        });

        const info1 = await transporter.sendMail({
            from: "bansall619@gmail.com", // sender address
            to: "bansall619@gmail.com", // list of receivers
            subject: "Contact", // Subject line
            text: name + " Has contact you email is " + email + " for " + message, // plain text body
        });
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}


//router
const contactRouter = express.Router()
contactRouter.post("/", contact)

//app config
const app = express()
const port = 4000

//middleware
app.use(express.json())
app.use(cors());

//dbConnection
connectDb();

//api endpoints
app.use("/contact", contactRouter)

app.get("/", (req, res) => {
    res.send("api working")
})
app.listen(port, () => {

    console.log(`server started on http://localhost:${port}`)
})