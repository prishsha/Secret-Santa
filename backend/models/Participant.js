import mongoose from 'mongoose';

const participantSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});

export default mongoose.model("Participant", participantSchema);
