import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    async function confirm() {
      const requestData = {
        orderId: searchParams.get("orderId"),
        amount: searchParams.get("amount"),
        paymentKey: searchParams.get("paymentKey"),
      };

      try {

        // local은 테스트용 추후 백엔드 배포 주소로 바꿔야함
        // const response = await fetch("https://be.goodjob.ai.kr/payments/confirm", {

        const response = await fetch("http://localhost:8080/payments/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
             Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
          body: JSON.stringify(requestData),
        });

        const text = await response.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch (parseError) {
          throw { message: text, code: "INVALID_JSON" };
        }

        if (!response.ok) {
          throw { message: json.message || "서버 오류", code: json.code || "SERVER_ERROR" };
        }

        setResponseData(json);
      } catch (error) {
        navigate(`/fail?code=${error.code}&message=${encodeURIComponent(error.message)}`);
      }
    }

    confirm();
  }, [searchParams, navigate]);

  return (
    <>
      <div className="box_section" style={{ width: "600px" }}>
        <img width="100px" src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png" alt="성공 이미지" />
        <h2>결제를 완료했어요</h2>
        <div className="p-grid typography--p" style={{ marginTop: "50px" }}>
          <div className="p-grid-col text--left"><b>결제금액</b></div>
          <div className="p-grid-col text--right" id="amount">
            {`${Number(searchParams.get("amount")).toLocaleString()}원`}
          </div>
        </div>
        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left"><b>주문번호</b></div>
          <div className="p-grid-col text--right" id="orderId">
            {searchParams.get("orderId")}
          </div>
        </div>
        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left"><b>paymentKey</b></div>
          <div className="p-grid-col text--right" id="paymentKey" style={{ whiteSpace: "initial", width: "250px" }}>
            {searchParams.get("paymentKey")}
          </div>
        </div>
        <div className="p-grid-col">
          <Link to="https://docs.tosspayments.com/guides/v2/payment-widget/integration">
            <button className="button p-grid-col5">연동 문서</button>
          </Link>
          <Link to="https://discord.gg/A4fRFXQhRu">
            <button className="button p-grid-col5" style={{ backgroundColor: "#e8f3ff", color: "#1b64da" }}>
              실시간 문의
            </button>
          </Link>
        </div>
      </div>
      <div className="box_section" style={{ width: "600px", textAlign: "left" }}>
        <b>Response Data :</b>
        <div id="response" style={{ whiteSpace: "initial" }}>
          {responseData && <pre>{JSON.stringify(responseData, null, 4)}</pre>}
        </div>
      </div>
    </>
  );
}
