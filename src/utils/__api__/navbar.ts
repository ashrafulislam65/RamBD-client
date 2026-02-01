const getNavbarServices = async () => {
    try {
        const response = await fetch("https://admin.felnatech.com/home-menu", { next: { revalidate: 3600 } });
        if (!response.ok) return null;
        return response.json();
    } catch (error) {
        console.error("getNavbarServices face error:", error);
        return null;
    }
};

export default { getNavbarServices };
