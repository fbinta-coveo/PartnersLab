import React, {useContext} from "react";
import { Theme } from "../../config/theme";
import styled from "styled-components";
import { chevronRight } from "react-icons-kit/feather/chevronRight";
import { Icon } from "react-icons-kit";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {LanguageContext} from "../Internationalization/LanguageUtils";
import {SearchConfigTranslations} from "../../config/InternationalizationConfig";

interface RecommendationCardType {
  title: string;
  description: string;
  image: string;
  video?: boolean;
  clickUri: string;
  onClick: () => void;
  onContextMenu: () => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
  source?: string;
}

const RecommendtionCard: React.FC<RecommendationCardType> = ({
  title,
  description,
  image,
  video = true,
  clickUri,
  onClick,
  onContextMenu,
  onMouseDown,
  onMouseUp,
  source = "",
}) => {
  const { getText } = useContext(LanguageContext);
  const label =video ? getText("Watch now", SearchConfigTranslations, "watchNow"):getText("Learn more", SearchConfigTranslations, "learnMore")

  return (
    <MainWrapper
      key={title}
      onClick={() => {
        onClick();
        window.open(clickUri, "_blank", "noopener,noreferrer");
      }}
      onContextMenu={onContextMenu}
      /* onMouseDown = {onMouseDown}
        onMouseUp = {onMouseUp} */
    >
      { image && 
      <ImageContainer>
        <Image src={image} />
      </ImageContainer>
      }
      <TextWrapper>
        <Title>{title}</Title>
        <SubTitle>{description}</SubTitle>
        <ReferralLink>
          {label}
          <div style={{ marginLeft: "5px", color: Theme.primary}}>
            <Icon icon={chevronRight} />
          </div>
        </ReferralLink>
      </TextWrapper>
    </MainWrapper>
  );
};

export const SkeletonRecommendtionCard: React.FC = () => {
  return (
    <MainWrapper>
      <Skeleton
        style={{ height: "250px", position: "relative", top: "-5px" }}
      />
      <div style={{ padding: "30px 20px" }}>
        <Skeleton count={1} style={{ marginBottom: "20px", height: "50px" }} />
        <Skeleton count={2} style={{ margin: "10px 0px" }} />
      </div>
    </MainWrapper>
  );
};

const ImageContainer = styled.div`
  overflow: hidden;
  border-radius: 16px 16px 0px 0px;
`;

const Image = styled.img`
  height: 250px;
  width: 100%;
  object-fit: cover;
  transition: 0.2s ease-in-out all;
`;
const TextWrapper = styled.div`
  display: flex;
  width: fit-content;
  align-items: center;
  padding: 10px 10px;
  flex-direction: column;
`;

const Title = styled.a`
  font-family: inherit;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  color: ${Theme.primaryText};
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 3;
  line-clamp: 3; 
  -webkit-box-orient: vertical;;
  text-align:center;
  height: 95px;
`;

const SubTitle = styled.span`
  font-family: inherit;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  height: 78px;
  line-height: 26px;
  color: ${Theme.primaryText};
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  line-clamp: 3; 
  -webkit-box-orient: vertical;
  width: 280px;
  text-align:center;
  margin-bottom: 10px;
  height: 80px;
`;

const ReferralLink = styled.a`
  font-family: inherit;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  color: ${Theme.primary};
  text-decoration: none;
  display: flex;
  align-self: flex-start;
  opacity: 0.8;
  cursor: pointer;
`;

const MainWrapper = styled.div`
  height: auto;
  width: 300px;
  border-radius: 16px;
  border: 1px solid #e5e8e8;
 
  margin: 20px;
  background: white;
  cursor: pointer;
  
  &:hover ${Title} {
    color: ${Theme.primary};
  }

  &:hover ${Image} {
    transform: scale(1.03);
  }

  &:hover ${ReferralLink} {
    opacity: 1;
  }
  @media (max-width: 480px) {
    width: 90vw;
  }
`;

export default RecommendtionCard;
