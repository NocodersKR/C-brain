import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AdminIcon } from '../components/AdminIcon'
import { AdminFormLayout } from '../components/admin-form/AdminFormLayout'
import './BlogFormPage.css'
import './LinkPayFormPage.css'

type LinkPayFormState = {
  readonly amount: string
  readonly client: string
  readonly paymentName: string
}

const initialLinkPayForm: LinkPayFormState = {
  amount: '',
  client: '',
  paymentName: '',
}

function formatAmount(value: string) {
  return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function LinkPayFormPage() {
  const formId = useId().replaceAll(':', '')
  const navigate = useNavigate()
  const [form, setForm] = useState<LinkPayFormState>(initialLinkPayForm)

  function updateForm<Key extends keyof LinkPayFormState>(key: Key, value: LinkPayFormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate('/linkpay')
  }

  return (
    <AdminFormLayout
      actions={
        <>
          <Link className="admin-form__button admin-form__button--outline" to="/linkpay">
            목록으로
          </Link>
          <button className="admin-form__button admin-form__button--solid" type="submit">
            <span>등록하기</span>
            <AdminIcon name="arrow-right" />
          </button>
        </>
      }
      onSubmit={handleSubmit}
      title="신규 링크페이 등록"
    >
      <label className="blog-form__field" htmlFor={`${formId}-client`}>
        <span className="blog-form__label">고객사명</span>
        <input
          autoComplete="organization"
          className="blog-form__control"
          id={`${formId}-client`}
          name="client"
          onChange={(event) => updateForm('client', event.currentTarget.value)}
          placeholder="고객사명을 입력해주세요."
          required
          type="text"
          value={form.client}
        />
      </label>

      <label className="blog-form__field" htmlFor={`${formId}-payment-name`}>
        <span className="blog-form__label">결제명</span>
        <input
          autoComplete="off"
          className="blog-form__control"
          id={`${formId}-payment-name`}
          name="paymentName"
          onChange={(event) => updateForm('paymentName', event.currentTarget.value)}
          placeholder="결제명을 입력해주세요."
          required
          type="text"
          value={form.paymentName}
        />
      </label>

      <label className="blog-form__field" htmlFor={`${formId}-amount`}>
        <span className="blog-form__label">결제 금액</span>
        <span className="linkpay-form__amount">
          <input
            autoComplete="off"
            className="blog-form__control linkpay-form__amount-input"
            id={`${formId}-amount`}
            inputMode="numeric"
            name="amount"
            onChange={(event) =>
              updateForm('amount', formatAmount(event.currentTarget.value))
            }
            pattern="[0-9,]+"
            placeholder="결제 금액을 입력해주세요.(숫자만 입력)"
            required
            type="text"
            value={form.amount}
          />
          <span className="linkpay-form__amount-unit">원</span>
        </span>
      </label>
    </AdminFormLayout>
  )
}
