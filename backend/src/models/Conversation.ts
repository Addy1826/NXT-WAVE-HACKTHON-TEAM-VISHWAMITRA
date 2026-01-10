import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
    participants: mongoose.Types.ObjectId[];
    adminId?: mongoose.Types.ObjectId; // Group admin (therapist)
    isGroupChat: boolean; // Flag for group vs 1:1
    groupName?: string; // Optional group name
    lastMessage?: string;
    lastMessageAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ConversationSchema: Schema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isGroupChat: { type: Boolean, default: false },
    adminId: { type: Schema.Types.ObjectId, ref: 'User' },
    groupName: { type: String },
    lastMessage: { type: String },
    lastMessageAt: { type: Date }
}, { timestamps: true });

export default mongoose.model<IConversation>('Conversation', ConversationSchema);
