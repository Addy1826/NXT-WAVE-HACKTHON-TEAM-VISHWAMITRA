import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, BookOpen, Video, FileText } from "lucide-react";

interface Resource {
    id: string;
    type: "video" | "article";
    title: string;
    category: string;
    videoId?: string;
    thumbnail?: string;
    url?: string;
    description: string;
}

interface VideoModalProps {
    videoId: string;
    title: string;
    onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ videoId, title, onClose }) => {
    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="bg-white rounded-xl max-w-4xl w-full overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                    <h3 className="text-xl font-heading text-neutral-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="aspect-video">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </motion.div>
        </motion.div>
    );
};

export const PatientResourcesPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string } | null>(null);

    const categories = ["All", "Meditation", "Sleep", "Anxiety", "Depression"];

    const resources: Resource[] = [
        {
            id: "v1",
            type: "video",
            title: "10-Minute Guided Meditation for Beginners",
            category: "Meditation",
            videoId: "inpok4MKVLM",
            thumbnail: "https://img.youtube.com/vi/inpok4MKVLM/mqdefault.jpg",
            description: "A gentle introduction to mindfulness meditation"
        },
        {
            id: "v2",
            type: "video",
            title: "Sleep Meditation for Deep Restful Sleep",
            category: "Sleep",
            videoId: "ZToicYcHIOU",
            thumbnail: "https://img.youtube.com/vi/ZToicYcHIOU/mqdefault.jpg",
            description: "Fall asleep faster with this calming meditation"
        },
        {
            id: "v3",
            type: "video",
            title: "Breathing Exercises for Anxiety Relief",
            category: "Anxiety",
            videoId: "SEfs5TJZ6Nk",
            thumbnail: "https://img.youtube.com/vi/SEfs5TJZ6Nk/mqdefault.jpg",
            description: "Quick breathing techniques to calm anxiety"
        },
        {
            id: "v4",
            type: "video",
            title: "Yoga for Mental Clarity and Focus",
            category: "Meditation",
            videoId: "v7AYKMP6rOE",
            thumbnail: "https://img.youtube.com/vi/v7AYKMP6rOE/mqdefault.jpg",
            description: "Gentle yoga practice to clear your mind"
        },
        {
            id: "a1",
            type: "article",
            title: "Understanding Panic Attacks: Causes and Management",
            category: "Anxiety",
            url: "https://www.mayoclinic.org/diseases-conditions/panic-attacks/symptoms-causes/syc-20376021",
            description: "Comprehensive guide to recognizing and managing panic attacks"
        },
        {
            id: "a2",
            type: "article",
            title: "Sleep Hygiene: Tips for Better Sleep",
            category: "Sleep",
            url: "https://www.healthline.com/nutrition/sleep-hygiene",
            description: "Science-backed strategies for improving sleep quality"
        },
        {
            id: "a3",
            type: "article",
            title: "Mindfulness Meditation: A Research-Based Approach",
            category: "Meditation",
            url: "https://www.mayoclinic.org/tests-procedures/meditation/in-depth/meditation/art-20045858",
            description: "Evidence-based benefits of regular meditation practice"
        },
        {
            id: "a4",
            type: "article",
            title: "Coping with Depression: Self-Help Strategies",
            category: "Depression",
            url: "https://www.helpguide.org/articles/depression/coping-with-depression.htm",
            description: "Practical tools and techniques for managing depression"
        },
        {
            id: "a5",
            type: "article",
            title: "The Science of Breathing and Stress Relief",
            category: "Anxiety",
            url: "https://www.healthline.com/health/breathing-exercises-for-anxiety",
            description: "How controlled breathing can reduce stress and anxiety"
        }
    ];

    const filteredResources = selectedCategory === "all"
        ? resources
        : resources.filter(r => r.category.toLowerCase() === selectedCategory.toLowerCase());

    return (
        <div className="min-h-screen bg-neutral-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-neutral-200 p-6">
                <h2 className="text-2xl font-heading text-neutral-900 mb-6">Categories</h2>
                <nav className="space-y-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category.toLowerCase())}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${selectedCategory === category.toLowerCase()
                                    ? "bg-primary-100 text-primary-700 font-medium"
                                    : "text-neutral-700 hover:bg-neutral-100"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </nav>

                <div className="mt-8 p-4 bg-secondary-50 rounded-lg">
                    <h3 className="font-semibold text-secondary-900 mb-2">Need Help?</h3>
                    <p className="text-sm text-secondary-700 mb-3">
                        Talk to our AI assistant for personalized resource recommendations.
                    </p>
                    <button className="w-full px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors text-sm font-medium">
                        Chat with AI
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-heading text-neutral-900 mb-2">Mental Health Resources</h1>
                        <p className="text-neutral-600">
                            Curated videos and articles to support your wellness journey
                        </p>
                    </div>

                    {/* Videos Section */}
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-6">
                            <Video className="w-6 h-6 text-primary-600" />
                            <h2 className="text-2xl font-heading text-neutral-900">Video Library</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredResources
                                .filter(r => r.type === "video")
                                .map((resource) => (
                                    <motion.div
                                        key={resource.id}
                                        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                        whileHover={{ y: -4 }}
                                        onClick={() => setSelectedVideo({ id: resource.videoId!, title: resource.title })}
                                    >
                                        <div className="relative">
                                            <img
                                                src={resource.thumbnail}
                                                alt={resource.title}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                                                    <Play className="w-8 h-8 text-primary-600 ml-1" />
                                                </div>
                                            </div>
                                            <span className="absolute top-2 right-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                                                {resource.category}
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2">
                                                {resource.title}
                                            </h3>
                                            <p className="text-sm text-neutral-600 line-clamp-2">
                                                {resource.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    </div>

                    {/* Articles Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <BookOpen className="w-6 h-6 text-secondary-600" />
                            <h2 className="text-2xl font-heading text-neutral-900">Articles & Guides</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredResources
                                .filter(r => r.type === "article")
                                .map((resource) => (
                                    <motion.a
                                        key={resource.id}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow block"
                                        whileHover={{ x: 4 }}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-neutral-100 rounded-lg">
                                                <FileText className="w-6 h-6 text-neutral-600" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-xs font-medium text-secondary-600 mb-1 block">
                                                    {resource.category}
                                                </span>
                                                <h3 className="font-semibold text-neutral-900 mb-2">
                                                    {resource.title}
                                                </h3>
                                                <p className="text-sm text-neutral-600 line-clamp-2">
                                                    {resource.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.a>
                                ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <VideoModal
                        videoId={selectedVideo.id}
                        title={selectedVideo.title}
                        onClose={() => setSelectedVideo(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
