package com.its.domain.entities;

/**
 * File formats for learning materials
 * Supports multiple file types for flexible content delivery
 */
public enum FileFormat {
    // Text formats
    TEXT("Text", "text/plain", ".txt"),
    
    // Document formats
    PDF("PDF Document", "application/pdf", ".pdf"),
    WORD("Word Document", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx"),
    
    // Presentation formats
    POWERPOINT("PowerPoint Presentation", "application/vnd.openxmlformats-officedocument.presentationml.presentation", ".pptx"),
    
    // Image formats
    IMAGE_PNG("PNG Image", "image/png", ".png"),
    IMAGE_JPG("JPEG Image", "image/jpeg", ".jpg"),
    IMAGE_GIF("GIF Image", "image/gif", ".gif"),
    IMAGE_SVG("SVG Image", "image/svg+xml", ".svg"),
    
    // Video formats
    VIDEO_MP4("MP4 Video", "video/mp4", ".mp4"),
    VIDEO_WEBM("WebM Video", "video/webm", ".webm"),
    VIDEO_AVI("AVI Video", "video/x-msvideo", ".avi"),
    
    // Audio formats
    AUDIO_MP3("MP3 Audio", "audio/mpeg", ".mp3"),
    AUDIO_WAV("WAV Audio", "audio/wav", ".wav"),
    
    // Archive formats
    ZIP("ZIP Archive", "application/zip", ".zip"),
    
    // Other formats
    JSON("JSON Data", "application/json", ".json"),
    HTML("HTML Document", "text/html", ".html"),
    MARKDOWN("Markdown", "text/markdown", ".md");

    private final String displayName;
    private final String mimeType;
    private final String extension;

    FileFormat(String displayName, String mimeType, String extension) {
        this.displayName = displayName;
        this.mimeType = mimeType;
        this.extension = extension;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getMimeType() {
        return mimeType;
    }

    public String getExtension() {
        return extension;
    }

    public boolean isImageFormat() {
        return this == IMAGE_PNG || this == IMAGE_JPG || this == IMAGE_GIF || this == IMAGE_SVG;
    }

    public boolean isVideoFormat() {
        return this == VIDEO_MP4 || this == VIDEO_WEBM || this == VIDEO_AVI;
    }

    public boolean isAudioFormat() {
        return this == AUDIO_MP3 || this == AUDIO_WAV;
    }

    public boolean isDocumentFormat() {
        return this == PDF || this == WORD || this == POWERPOINT;
    }

    public static FileFormat fromMimeType(String mimeType) {
        for (FileFormat format : values()) {
            if (format.mimeType.equals(mimeType)) {
                return format;
            }
        }
        return TEXT; // Default fallback
    }

    public static FileFormat fromExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return TEXT;
        }
        String ext = filename.substring(filename.lastIndexOf(".")).toLowerCase();
        for (FileFormat format : values()) {
            if (format.extension.equalsIgnoreCase(ext)) {
                return format;
            }
        }
        return TEXT; // Default fallback
    }
}
