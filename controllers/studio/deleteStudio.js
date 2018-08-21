module.exports = async (req, res) => {
    try {
        const postgres = req.app.get('postgres');
        const StudioModel = postgres.getModel('Studio');

        res.json('DELETE STUDIO')
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
};