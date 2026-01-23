import React, { useRef, useState, useEffect } from 'react';
import { Box, TextField } from '@mui/material';

const PinInput = ({ length = 4, onChange, error }) => {
    const [values, setValues] = useState(Array(length).fill(''));
    const inputRefs = useRef([]);

    useEffect(() => {
        // Reset if parent clears (optional logic, but good for retries)
        // For simplicity, we trust parent manages validity state mostly.
    }, []);

    const handleChange = (index, e) => {
        const val = e.target.value;
        if (isNaN(val)) return; // Only numbers

        const newValues = [...values];
        // Allow only 1 char
        newValues[index] = val.slice(-1);
        setValues(newValues);
        onChange(newValues.join(''));

        // Auto-advance
        if (val && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !values[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').slice(0, length).split('');
        const newValues = Array(length).fill('');
        pasted.forEach((char, i) => {
            if (!isNaN(char)) newValues[i] = char;
        });
        setValues(newValues);
        onChange(newValues.join(''));
        // Focus last filled
        const lastIndex = Math.min(pasted.length, length) - 1;
        if (lastIndex >= 0) inputRefs.current[lastIndex].focus();
    };

    return (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            {values.map((val, index) => (
                <TextField
                    key={index}
                    inputRef={el => inputRefs.current[index] = el}
                    value={val}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    error={error}
                    size="small"
                    inputProps={{
                        style: { textAlign: 'center', fontSize: '1.25rem', fontWeight: 'bold' },
                        maxLength: 1,
                        inputMode: 'numeric'
                    }}
                    sx={{ width: 48 }}
                />
            ))}
        </Box>
    );
};

export default PinInput;
