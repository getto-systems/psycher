exports.init = () => init();

const init = () => {
  return {
    action: {
      deploy: {
        success: "thumbsup",
        failure: "x",
      },
      deploy_target_not_found: {
        messages: [
          "どれをリリースしたらいいのかわかりません！",
          "リリースする対象が不明です",
          "（・・・・・・何をリリースするんだろう？）",
        ],
      },
      greeting: {
        messages: [
          "よろしくお願いいたします",
          "おっすおっす",
          "よろしくね！",
        ],
      },
      unknown_mention: {
        messages: [
          "は？",
          "何言ってるの？",
          "・・・・・・・・・・・・？",
        ],
      },
    },
    conversation: {
      words: {
        deploy: [
          "リリース",
          "release",
        ],
        greeting: [
          "よろ",
        ],
      },
    },
  };
};
