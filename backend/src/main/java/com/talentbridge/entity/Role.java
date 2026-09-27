package com.talentbridge.entity;

/**
 * Defines the user roles within the TalentBridge recruitment platform.
 * Using standard Spring Security role prefix "ROLE_".
 */
public enum Role {
    ROLE_CANDIDATE,
    ROLE_RECRUITER,
    ROLE_ADMIN
}
