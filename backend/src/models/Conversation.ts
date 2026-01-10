import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
    participants: mongoose.Types.ObjectId[];
    type: 'direct' | 'group';
    lastMessage?: mongoose.Types.ObjectId;
    groupName?: string;
    groupAdmin?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ConversationSchema: Schema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    type: { type: String, enum: ['direct', 'group'], default: 'direct' },
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Chat' },
    groupName: { type: String },
    groupAdmin: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model<IConversation>('Conversation', ConversationSchema);
