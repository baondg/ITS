package com.its.domain.entities;

/**
 * Content types supporting Open/Closed Principle
 * New types can be added without modifying existing code
 */
public enum ContentType {
    TEXT("Text", "text/plain"),
    VIDEO("Video", "video/*"),
    INTERACTIVE_EXERCISE("Interactive Exercise", "application/json");

    private final String displayName;
    private final String mimeTypePattern;

    ContentType(String displayName, String mimeTypePattern) {
        this.displayName = displayName;
        this.mimeTypePattern = mimeTypePattern;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getMimeTypePattern() {
        return mimeTypePattern;
    }

    public boolean isFileUploadRequired() {
        return this == VIDEO;
    }

    public boolean supportsInlineContent() {
        return this == TEXT || this == INTERACTIVE_EXERCISE;
    }
}