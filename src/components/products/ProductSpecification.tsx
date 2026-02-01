"use client";

import { H3 } from "@component/Typography";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";

export default function ProductSpecification() {
    const specs = [
        { label: "Model", value: "Felna Elite X1" },
        { label: "Processor", value: "Intel Core i7-13700H" },
        { label: "Memory", value: "16GB DDR5 5200MHz" },
        { label: "Storage", value: "1TB NVMe Gen4 SSD" },
        { label: "Display", value: "15.6\" QHD (2560 x 1440) 165Hz" },
        { label: "Graphics", value: "NVIDIA GeForce RTX 4060 8GB" },
        { label: "Battery", value: "90Wh Lithium-ion" },
        { label: "Warranty", value: "2 Years International" },
    ];

    return (
        <Box>
            <H3 mb="1.5rem">Specifications</H3>

            {specs.map((spec, ind) => (
                <FlexBox
                    key={ind}
                    py="10px"
                    px="15px"
                    bg={ind % 2 === 0 ? "gray.100" : "white"}
                    borderBottom="1px solid"
                    borderColor="gray.300"
                    alignItems="center"
                >
                    <Box width="30%" color="text.muted" fontWeight="600">{spec.label}</Box>
                    <Box width="70%">{spec.value}</Box>
                </FlexBox>
            ))}
        </Box>
    );
}
