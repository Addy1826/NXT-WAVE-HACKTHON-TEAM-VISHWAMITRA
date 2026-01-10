import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
    conversationId: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    content: string;
    type: 'text' | 'image' | 'file' | 'system' | 'bot_response';
    readBy: mongoose.Types.ObjectId[];
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
}

const ChatSchema: Schema = new Schema({
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: false }, // Allow null for bot
    content: { type: String, required: true },
    type: { type: String, enum: ['text', 'image', 'file', 'system', 'bot_response'], default: 'text' },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    metadata: { type: Schema.Types.Mixed }
}, { timestamps: true });

export default mongoose.model<IChat>('Chat', ChatSchema);
