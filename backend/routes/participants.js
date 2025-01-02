import express from 'express';
import Participant from '../models/Participant.js';

const router = express.Router();

// Add a participant
router.post('/', async (req, res) => {
  const { name, email } = req.body;

  try {
    // Create a new participant using the model
    const newParticipant = new Participant({ name, email });
    // Save the participant to the database
    const savedParticipant = await newParticipant.save();
    res.status(201).json({ success: true, participant: savedParticipant });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all participants
router.get('/', async (req, res) => {
  try {
    const participants = await Participant.find();
    res.status(200).json(participants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching participants" });
  }
});

router.get('/assign', async (req, res) => {
  try {
    const participants = await Participant.find();
    if (participants.length < 2) return res.status(400).json({ message: "Not enough participants" });

    let receivers = [...participants];

    const assignments = [];

    for (const giver of participants) {
      // Filter out giver from receivers
      let potentialReceivers = receivers.filter(receiver => receiver._id.toString() !== giver._id.toString());

      // Handle edge case: last giver with no valid receivers
      if (potentialReceivers.length === 0) {
        // Shuffle and retry
        receivers = [...participants];
        assignments.length = 0; // Reset assignments
        return res.redirect('/assign'); // Retry the assignment process
      }

      // Select a random receiver
      const randomIndex = Math.floor(Math.random() * potentialReceivers.length);
      const receiver = potentialReceivers[randomIndex];

      // Remove the chosen receiver from the receivers list
      receivers = receivers.filter(r => r._id.toString() !== receiver._id.toString());

      assignments.push({ giver: giver.name, receiver: receiver.name });
    }

    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error assigning Secret Santas:", error);
    res.status(500).json({ message: "Error assigning Secret Santas" });
  }
});

// Delete a participant by name
router.delete('/:name', async (req, res) => {
  const { name } = req.params;

  try {
    // Find and delete the participant by name
    const deletedParticipant = await Participant.findOneAndDelete({ name });

    if (!deletedParticipant) {
      return res.status(404).json({ success: false, message: 'Participant not found' });
    }

    res.status(200).json({ success: true, message: 'Participant deleted successfully', participant: deletedParticipant });
  } catch (error) {
    console.error('Error deleting participant:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});



export default router;
