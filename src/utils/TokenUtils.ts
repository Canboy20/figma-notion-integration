import { TokenTierFigmaTypes} from '../constants/Figma/TokenTierTypes';


/**
 * Returns the tier type of the token
 */
export function getTokenTierType(tokenName: string) {

    var tokenTier;

    if(tokenName.includes(TokenTierFigmaTypes.COMPONENT)){
        tokenTier = "COMPONENT";
    }else if(tokenName.includes(TokenTierFigmaTypes.SYSTEM)){
        tokenTier = "SYSTEM";
    }else if(tokenName.includes(TokenTierFigmaTypes.COLOR)){
        tokenTier = "CORE";
    }else{
        tokenTier = "NA";
    }

    return tokenTier;

}


/**
 * Returns the type of the token
 */
export function getTokenType(tokenTypeName: string) {

    var tokenType;

    if (tokenTypeName.includes(TokenTierFigmaTypes.COLOR)) {
        tokenType = "COLOR";
    } else {
        tokenType = "OTHER";
    }

    return tokenType;

}