const express = require("express");
const app = express();
const path = require("path");
const linkedInController = require('./Controllers/linkedin_controller')
const verify = require('./Middlewares/verify_token');
const { error } = require("console");
const PORT = 3000
app.use(express.json());


app.use('/downloadedCV' , express.static(path.join(__dirname, 'downloaded CV')));


app.post("/post-job" , linkedInController.postJob)

app.post("/applicant-names", async (req, res) => {
  try {
    const {user_name , password} = req.body;
    if(!user_name || !password )
    {
      res.status(500).json({ success: false, message:"missing val" });
    }
    const result = await linkedInController.getApplicants(user_name , password);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
