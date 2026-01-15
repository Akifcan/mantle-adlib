"use client"

import { useState, useCallback } from "react"

interface ErrorDialogState {
  isOpen: boolean
  title?: string
  message: string
  type: "error" | "warning" | "network" | "blockchain" | "success"
  primaryAction?: {
    label: string
    onClick: () => void
    variant?: "default" | "destructive"
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export function useErrorDialog() {
  const [dialogState, setDialogState] = useState<ErrorDialogState>({
    isOpen: false,
    message: "",
    type: "error",
  })

  const showDialog = useCallback((config: Omit<ErrorDialogState, "isOpen">) => {
    setDialogState({
      ...config,
      isOpen: true,
    })
  }, [])

  const closeDialog = useCallback(() => {
    setDialogState((prev) => ({
      ...prev,
      isOpen: false,
    }))
  }, [])

  // Specific dialog types
  const showError = useCallback(
    (message: string, title?: string, actions?: ErrorDialogState["primaryAction"]) => {
      showDialog({
        type: "error",
        title,
        message,
        primaryAction: actions,
      })
    },
    [showDialog],
  )

  const showWarning = useCallback(
    (message: string, title?: string) => {
      showDialog({
        type: "warning",
        title,
        message,
      })
    },
    [showDialog],
  )

  const showSuccess = useCallback(
    (message: string, title?: string) => {
      showDialog({
        type: "success",
        title,
        message,
      })
    },
    [showDialog],
  )

  const showWalletError = useCallback(
    (message: string) => {
      showDialog({
        type: "blockchain",
        title: "Wallet Hatası",
        message,
        primaryAction: {
          label: "Tekrar Dene",
          onClick: () => window.location.reload(),
        },
        secondaryAction: {
          label: "İptal",
          onClick: closeDialog,
        },
      })
    },
    [showDialog, closeDialog],
  )

  const showNetworkError = useCallback(
    (message: string) => {
      showDialog({
        type: "network",
        title: "Bağlantı Hatası",
        message,
        primaryAction: {
          label: "Yeniden Dene",
          onClick: () => window.location.reload(),
        },
      })
    },
    [showDialog],
  )

  const showConfirmation = useCallback(
    (message: string, onConfirm: () => void, title = "Emin misiniz?", confirmLabel = "Evet", cancelLabel = "İptal") => {
      showDialog({
        type: "warning",
        title,
        message,
        primaryAction: {
          label: confirmLabel,
          onClick: onConfirm,
          variant: "destructive",
        },
        secondaryAction: {
          label: cancelLabel,
          onClick: closeDialog,
        },
      })
    },
    [showDialog, closeDialog],
  )

  return {
    dialogState,
    closeDialog,
    showDialog,
    showError,
    showWarning,
    showSuccess,
    showWalletError,
    showNetworkError,
    showConfirmation,
  }
}
