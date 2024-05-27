export const handleInputChange = (event, setFormData, formatCurrency) => {
    const { name, value } = event.target;
    let formattedValue = value;

    if (name === 'average_price' || name === 'final_price') {
        formattedValue = formatCurrency(value);
    }

    setFormData(prevState => ({
        ...prevState,
        [name]: formattedValue
    }));
};

export const handleImageChange = (event, setFormData) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
        setFormData(prevState => ({
            ...prevState,
            image_base64: reader.result
        }));
    };
    reader.readAsDataURL(file);
};