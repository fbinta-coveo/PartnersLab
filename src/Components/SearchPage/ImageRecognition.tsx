import React, { useState, useContext, useRef , useEffect} from "react";
import { IconButton, Backdrop } from "@mui/material";
import { LanguageContext } from "../Internationalization/LanguageUtils";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import styled , { keyframes } from "styled-components";
import axios from 'axios';
import _ from "lodash";
import adminLogo from "../../assets/coveo-spinner.gif";
import { ImageToText } from "../../config/SearchConfig";
// import 'react-image-crop/dist/ReactCrop.css';
// import { ImageToText } from "../../config/SearchConfig"; // this is just to enable or disable but for now its always enabled
const namedColors = [
    { name: 'black', rgb: { red: 0, green: 0, blue: 0 } },
    { name: 'white', rgb: { red: 255, green: 255, blue: 255 } },
    { name: 'red', rgb: { red: 255, green: 0, blue: 0 } },
    { name: 'green', rgb: { red: 0, green: 255, blue: 0 } },
    { name: 'blue', rgb: { red: 0, green: 0, blue: 255 } },
    { name: 'yellow', rgb: { red: 255, green: 255, blue: 0 } },
    { name: 'cyan', rgb: { red: 0, green: 255, blue: 255 } },
    { name: 'magenta', rgb: { red: 255, green: 0, blue: 255 } },
    { name: 'silver', rgb: { red: 192, green: 192, blue: 192 } },
    { name: 'gray', rgb: { red: 128, green: 128, blue: 128 } },
    { name: 'maroon', rgb: { red: 128, green: 0, blue: 0 } },
    { name: 'olive', rgb: { red: 128, green: 128, blue: 0 } },
    { name: 'purple', rgb: { red: 128, green: 0, blue: 128 } },
    { name: 'teal', rgb: { red: 0, green: 128, blue: 128 } },
    { name: 'navy', rgb: { red: 0, green: 0, blue: 128 } }
];
// Calculate the euclidean distance between two colors
const getDistance = (rgb1:any, rgb2:any) => {
    return Math.sqrt(
        Math.pow(rgb1.red - rgb2.red, 2) +
        Math.pow(rgb1.green - rgb2.green, 2) +
        Math.pow(rgb1.blue - rgb2.blue, 2)
    );
};

// Find the closest named color to a given RGB color
const findClosestColor = (color:any) => {
    let closestColor = namedColors[0];
    let minDistance = getDistance(color, namedColors[0].rgb);
    namedColors.forEach(namedColor => {
        const distance = getDistance(color, namedColor.rgb);
        if (distance < minDistance) {
            closestColor = namedColor;
            minDistance = distance;
        }
    });
    return closestColor.name;
};
export const ImageRecognitionButton = (props: any) => {
    const { controller } = props;
    const { selectedLanguage } = useContext(LanguageContext);
    const [isRecognizing, setIsRecognizing] = useState(false);
    const [isRendered, setIsRendered] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!ImageToText)
            return setIsRendered(false);
        setIsRendered(true);
    }, [])

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const base64Image = await toBase64(file);
            setIsRecognizing(true);
            try {
                const keywords = await recognizeImage(base64Image);

                // to remove special characters and extra spaces like \n found in some text
                const cleanedText = keywords.text.map((text: string) => text.replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase());
                // controller.updateText(keywords); //return as text
                const allKeywords = [keywords.labels, ...cleanedText, ...keywords.dominantColors, ...keywords.logoName];
                controller.updateText(_.capitalize(allKeywords.join(' ')));
                controller.submit();
                // For the main search page this isn't needed but is required for the search on the home page.
                
                window.open('/search' + window.location.hash,"_self");          
            } catch (error) {
                console.error("Image recognition failed:", error);
            } finally {
                setIsRecognizing(false);
                console.log("Image recognition completed");
            }
        }
    };
    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return isRendered ? (
        <div>
            <StyledImageInput
                accept="image/*"
                id="icon-button-file"
                type="file"
                onChange={handleImageUpload}
                ref={fileInputRef}
            />
            <StyledImageButton onClick={handleButtonClick} disabled={isRecognizing}>
                <PhotoCameraIcon style={isRecognizing ? inUseStyle : {}} />
            </StyledImageButton>

            

        <Backdrop open={isRecognizing} style={{ zIndex: 1 }}>
                <FlexContainer>
                    <div>
                        <img src={adminLogo} alt="Loading..." style={{width:"50px", height:"50px"}} />
                    </div>
                    <LoadingText>Searching for image...</LoadingText>
                </FlexContainer>
            </Backdrop>
        </div>
    ): null;
};







// Converting image file to base64 as required by the Google Cloud Vision API
const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});
// Recognising the image using Google Cloud Vision API
const recognizeImage = async (base64Image: string) => {
    const API_KEY = process.env.REACT_APP_GOOGLE_CLOUD_VISION_API_KEY;
    const visionEndpoint = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;
    const request = {
        requests: [
            {
                image: {
                    content: base64Image.split(',')[1], // To remove the data:image/jpeg;base64, part
                },
                // Features to extract from the image ,more features can be added like, LOGO_DETECTION,
                features: [
                    { type: "LABEL_DETECTION", maxResults: 3 }, // maxResults is to limit the number of labels returned
                    { type: "TEXT_DETECTION" }, // To get the text in the image
                    { type: "IMAGE_PROPERTIES" }, // To get the dominant colors
                ],
            },
        ],
    };

    const response = await axios.post(visionEndpoint, request);
    /*
      Extracting the labels, text, logo and dominant colors from the response, slice to get the top 5 results because
      the API returns a lot of results which makes it very sloww
    */
    const labels = response.data.responses[0].labelAnnotations
    ? response.data.responses[0].labelAnnotations.slice(0, 1).map((annotation: any) => annotation.description)
    : [];
    const text = response.data.responses[0].textAnnotations
        ? response.data.responses[0].textAnnotations.slice(0, 1).map((annotation: any) => annotation.description)
        : [];
    const dominantColors = response.data.responses[0].imagePropertiesAnnotation?.dominantColors?.colors
        ? response.data.responses[0].imagePropertiesAnnotation.dominantColors.colors.slice(0,1).map((color: any) => findClosestColor(color.color))
        : [];
    const logoName = response.data.responses[0].logoAnnotations
    ? response.data.responses[0].logoAnnotations.slice(0, 1).map((annotation: any) => annotation.description)
    : [];
    return { dominantColors, labels, logoName, text};
};

// Styling the image recognition button
const inUseStyle = {
    color: 'red'
};
const StyledImageInput = styled.input`
    display: none;
`;
const StyledImageButton = styled(IconButton)`
    transform: scale(0.75);
    padding: 0;
`;
const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const LoadingText = styled.div`
  margin-top: 10px; /* Adjust the spacing as needed */
  color: #FFFFFF;
`;


// CSS animation for spinning
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Spinning logo
const SpinningLogo = styled.img`
  animation: ${spin} 2s linear infinite;
  width: 100px; 
  height: 100px;
`;

export default ImageRecognitionButton;


