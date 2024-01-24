import jwt from "jsonwebtoken";
import {
  AuthToken,
  SkyWayAuthToken,
  nowInSec,
  uuidV4,
} from "@skyway-sdk/token";
import "dotenv/config";

export type PostAuthRequest = {
  body: {
    channelName: string;
    memberName: string;
  };
};

export const authUseCase = (req: PostAuthRequest, res: any) => {
  const { channelName, memberName } = req.body;

  //本来であれば、ここに認証処理を書く

  //JWTの期限設定
  const iat = Math.floor(Date.now() / 1000);
  const exp = Math.floor(Date.now() / 1000) + 36000;

  const credential = {
    channelName: channelName,
    memberName: memberName,
    iat: iat,
    exp: exp,
    authToken: calculateAuthToken(), //channelとmemberを指定したSkyWayAuthTokenを生成する
  };

  res.send(credential);
};

const appId = process.env.APP_ID;
const appSecret = process.env.APP_SECRET;

const calculateAuthToken = () => {
  //SkyWayAuthTokenのContentの作成
  const jwtContent = new SkyWayAuthToken({
    jti: uuidV4(),
    iat: nowInSec(),
    exp: nowInSec() + 60 * 60 * 24,
    scope: {
      app: {
        id: appId!,
        turn: true,
        actions: ["read"],
        channels: [
          {
            id: "*",
            name: "*",
            actions: ["write"],
            members: [
              {
                id: "*",
                name: "*",
                actions: ["write"],
                publication: {
                  actions: ["write"],
                },
                subscription: {
                  actions: ["write"],
                },
              },
            ],
            sfuBots: [
              {
                actions: ["write"],
                forwardings: [
                  {
                    actions: ["write"],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  }).encode(appSecret!);

  return jwtContent;
};
