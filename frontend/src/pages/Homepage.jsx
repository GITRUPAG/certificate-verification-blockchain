import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStudentCertificates } from "../api/certificateApi";


const primaryColor = "#4a90e2"; 
const secondaryColor = "#002d72"; 
const backgroundColor = "#ffffff"; 
const lightGray = "#f9f9fb"; 

const styles = {
    dashboardContainer: {
        display: "flex",
        minHeight: "100vh",
        backgroundColor: lightGray, 
    },
    
    sidebar: {
        width: "250px",
        backgroundColor: secondaryColor,
        color: "white",
        padding: "20px",
        boxShadow: "4px 0 10px rgba(0,0,0,0.1)", 
        display: "flex",
        flexDirection: "column",
        zIndex: 10, 
    },
    sidebarTitle: {
        fontSize: "1.75rem",
        fontWeight: "700",
        marginBottom: "40px",
        paddingBottom: "15px",
        borderBottom: `1px solid rgba(255,255,255,0.1)`,
    },
    navItem: {
        padding: "15px 10px",
        cursor: "pointer",
        fontSize: "1rem",
        marginBottom: "8px",
        transition: "all 0.3s ease",
        borderRadius: "8px", 
        display: "flex",
        alignItems: "center",
        fontWeight: "500",
        opacity: 0.7,
    },
    navItemHover: {
        backgroundColor: primaryColor, 
        opacity: 1,
        boxShadow: '0 4px 8px rgba(74, 144, 226, 0.3)',
    },
    
    buttonBase: {
        padding: "10px 15px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "0.9rem",
        transition: "background-color 0.3s, transform 0.1s",
        outline: 'none',
    },
    logoutButton: {
        backgroundColor: "#ff6b6b", 
        color: "white",
        marginLeft: "20px",
    },
    logoutButtonHover: {
        backgroundColor: "#e55a5a",
        transform: "translateY(-1px)",
    },
    mainContent: {
        flex: 1,
        padding: "30px 50px",
        backgroundColor: backgroundColor, 
    },
    contentHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "40px",
        paddingBottom: "10px",
        borderBottom: `1px solid #e0e0e0`, 
    },
    welcomeText: {
        fontSize: "2.25rem",
        color: secondaryColor,
        fontWeight: "700",
    },
    profileSection: {
        display: "flex",
        alignItems: "center",
        fontSize: "1rem",
        fontWeight: "500",
    },
    profileButton: { 
        backgroundColor: 'transparent',
        border: '1px solid #ccc',
        color: secondaryColor,
        padding: '8px 15px',
        borderRadius: '6px',
        marginRight: '10px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'background-color 0.2s, border-color 0.2s',
    },
    profileButtonHover: {
        backgroundColor: lightGray,
        borderColor: primaryColor,
        color: primaryColor,
    },
    cardGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "30px", 
    },
    card: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px", 
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)", 
        borderLeft: `5px solid ${primaryColor}`,
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: 'default',
    },
    cardHover: {
        transform: "translateY(-5px)",
        boxShadow: "0 12px 25px rgba(0,0,0,0.15)",
    },
    cardTitle: {
        fontSize: "1.3rem",
        color: primaryColor,
        marginBottom: "10px",
        fontWeight: "600",
    },
    cardBody: {
        fontSize: "0.95rem",
        color: "#555",
        lineHeight: 1.6,
        margin: "5px 0",
    },
    downloadButton: {
        backgroundColor: "#2ecc71", 
        color: "white",
        marginTop: "20px",
        padding: "12px 18px",
    },
};

// Component using the new styles
export default function Homepage() {
    const navigate = useNavigate();

    const username = localStorage.getItem("username");
    const studentId = localStorage.getItem("studentId");

    const [activeTab, setActiveTab] = useState("myCertificates");
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isLogoutHover, setIsLogoutHover] = useState(false);
    const [isProfileHover, setIsProfileHover] = useState(false); 
    const [hoveredCard, setHoveredCard] = useState(null);


    
    useEffect(() => {
        if (!studentId) return;

        const loadCertificates = async () => {
            try {
                const res = await fetchStudentCertificates(studentId);
                setCertificates(res.data);
            } catch (err) {
                console.error("Failed to load certificates:", err);
            } finally {
                setLoading(false);
            }
        };

        loadCertificates();
    }, [studentId]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleVerifyPage = () => {
        navigate("/verify");
    };
    
    
    const handleProfileClick = () => {
        navigate("/profile"); 
    };

    
    const renderCertificates = () => {
        if (loading) return <p style={{color: secondaryColor}}>Loading certificates...</p>;

        if (certificates.length === 0)
            return <p style={{color: secondaryColor}}>No certificates issued yet. Time to earn some!</p>;

        return (
            <div style={styles.cardGrid}>
                {certificates.map((cert) => (
                    <div 
                        key={cert.certificateId} 
                        style={{
                            ...styles.card,
                            ...(hoveredCard === cert.certificateId ? styles.cardHover : {})
                        }}
                        onMouseEnter={() => setHoveredCard(cert.certificateId)}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        <h3 style={styles.cardTitle}>🏆 {cert.studentName} Certificate</h3>
                        <p style={styles.cardBody}>
                            **ID:** {cert.certificateId}
                        </p>
                        <p style={styles.cardBody}>
                            **Key:** <code style={{backgroundColor: lightGray, padding: '2px 4px', borderRadius: '4px'}}>{cert.certificateKey.substring(0, 15)}...</code>
                        </p>
                        <p style={styles.cardBody}>
                            **Issued:** {cert.issuedAt}
                        </p>

                        <button
                            onClick={() =>
                                window.open(`http://localhost:8080${cert.pdfUrl}`, "_blank")
                            }
                            style={{
                                ...styles.buttonBase,
                                ...styles.downloadButton,
                            }}
                        >
                            ⬇️ Download PDF
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    const renderVerifyPrompt = () => (
        <div
            style={{
                ...styles.card,
                borderLeft: "5px solid #f39c12", 
                padding: "40px",
                maxWidth: "600px"
            }}
        >
            <h3 style={{ ...styles.cardTitle, color: "#f39c12" }}>
                🔎 Verify External Certificate
            </h3>
            <p style={styles.cardBody}>
                Use this tool to check the authenticity and validity of any certificate issued by the college.
            </p>
            <button
                onClick={handleVerifyPage}
                style={{
                    ...styles.buttonBase,
                    backgroundColor: "#f39c12",
                    color: "white",
                    marginTop: "25px",
                }}
            >
                Go to Verification Page
            </button>
        </div>
    );

    return (
        <div style={styles.dashboardContainer}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <h2 style={styles.sidebarTitle}>CertiHub</h2>

                <div
                    style={{
                        ...styles.navItem,
                        ...(activeTab === "myCertificates"
                            ? styles.navItemHover
                            : {}),
                    }}
                    onClick={() => setActiveTab("myCertificates")}
                >
                    📜 <span style={{marginLeft: '10px'}}>My Certificates</span>
                </div>

                <div
                    style={{
                        ...styles.navItem,
                        ...(activeTab === "verifyExternal"
                            ? styles.navItemHover
                            : {}),
                    }}
                    onClick={() => setActiveTab("verifyExternal")}
                >
                    ✅ <span style={{marginLeft: '10px'}}>Verify Certificate</span>
                </div>
            </div>

            {/* Main Content */}
            <div style={styles.mainContent}>
                <div style={styles.contentHeader}>
                    {/* The main dashboard title */}
                    <h1 style={styles.welcomeText}>
                        Student Dashboard
                    </h1>

                    {/* Profile and Logout Section */}
                    <div style={styles.profileSection}>
                        
                        {/* New Profile Button Structure */}
                        <div 
                            onClick={handleProfileClick}
                            onMouseEnter={() => setIsProfileHover(true)}
                            onMouseLeave={() => setIsProfileHover(false)}
                            style={{
                                ...styles.profileButton,
                                ...(isProfileHover ? styles.profileButtonHover : {})
                            }}
                        >
                            Profile
                        </div>
                        
                        <button 
                            onClick={handleLogout} 
                            style={{
                                ...styles.buttonBase,
                                ...styles.logoutButton,
                                ...(isLogoutHover ? styles.logoutButtonHover : {})
                            }}
                            onMouseEnter={() => setIsLogoutHover(true)}
                            onMouseLeave={() => setIsLogoutHover(false)}
                        >
                            🚪 Logout
                        </button>
                    </div>
                </div>

                {/* Content based on active tab */}
                {activeTab === "myCertificates"
                    ? renderCertificates()
                    : renderVerifyPrompt()}
            </div>
        </div>
    );
}