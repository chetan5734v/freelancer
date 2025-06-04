// backend/messages.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  formData: {
    type: String, // optional: split into sender/receiver
    required: true,
  },
  messages: [
    {
      sender: String,
      text: String,
      timestamp: Date,
    }
  ]
});

// Create model
const UserModel = mongoose.model('messages', userSchema);

// Create or update a message thread
async function MESSAGES(req, res) {
  try {
    const { formData, newMessage } = req.body;

    if (!formData || !newMessage) {
      return res.status(400).send('formData and newMessage are required');
    }

    const existingThread = await UserModel.findOne({ formData });

    if (existingThread) {
      existingThread.messages.push(newMessage);
      await existingThread.save();
      console.log(`Added message to existing thread: ${formData}`);
      return res.send(formData);
    } else {
      await UserModel.create({
        formData,
        messages: [newMessage],
      });
      console.log(`Created new message thread: ${formData}`);
      return res.send(formData);
    }
  } catch (err) {
    console.error('Error in MESSAGES:', err);
    res.status(500).send('Error creating/updating message');
  }
}


async function MESSAGES1(req, res) {
  try {
    const { formData, newMessage } = req.body;

    if (!formData) {
      return res.status(400).send('formData is required');
    }

    let thread = await UserModel.findOne({ formData });

    if (newMessage && newMessage.text && newMessage.text.trim()) {
      // Adding a new message
      if (!thread) {
        thread = new UserModel({ formData, messages: [] });
      }

      thread.messages.push(newMessage);
      await thread.save();
      console.log(`Message saved to thread ${formData}: ${newMessage.text.substring(0, 50)}...`);
      return res.status(200).json(newMessage);
    } else {
      // Fetching existing messages
      if (!thread) {
        console.log(`No thread found for ${formData}, returning empty array`);
        return res.status(200).json([]);
      }
      console.log(`Retrieved ${thread.messages.length} messages for thread ${formData}`);
      return res.status(200).json(thread.messages);
    }
  } catch (err) {
    console.error('Error in MESSAGES1:', err);
    return res.status(500).send('Server error');
  }
}

async function GETALLPOST(req, res) {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).send('postId is required');
    }    // Find all threads for this job using the new room ID format
    // Format: job_${jobId}_freelancer_${freelancerId}
    const threads = await UserModel.find({
      formData: { $regex: `^job_${postId}_freelancer_` }
    });

    console.log(`Found ${threads.length} message threads for job ${postId}`);
    res.json(threads);
  } catch (err) {
    console.error('Error retrieving message threads:', err);
    res.status(500).send('Error retrieving message threads');
  }
}




module.exports = {
  MESSAGES,
  MESSAGES1,
  GETALLPOST,
};
