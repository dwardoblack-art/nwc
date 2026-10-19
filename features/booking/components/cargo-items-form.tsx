import { useNwcColors, type NwcPalette } from "@/ui/use-nwc-colors";
import { cameraService } from "@/lib/services/device/camera-service";
import { mobileInputStyles } from "@/ui/mobile-input";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { AppIcon } from "@/ui/app-icon";
import { type CargoService, supportingDocumentCopy } from "@/lib/booking-cargo";

import { fileService } from "@/lib/services/device/file-service";
import type { BookingCargoAttachment, BookingCargoItem } from "@/types/cargo";

type Props = {
  service: CargoService;
  items: BookingCargoItem[];
  description?: string;
  photos?: BookingCargoAttachment[];
  supportingDocument?: BookingCargoAttachment;
  onChangeItems: (items: BookingCargoItem[]) => void;
  onChangeDescription: (value: string) => void;
  onChangePhotos: (photos: BookingCargoAttachment[]) => void;
  onChangeSupportingDocument: (
    attachment: BookingCargoAttachment | undefined,
  ) => void;
};

export function CargoItemsForm({
  service,
  items,
  description = "",
  photos = [],
  supportingDocument,
  onChangeItems,
  onChangeDescription,
  onChangePhotos,
  onChangeSupportingDocument,
}: Props) {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);

  const [extrasOpen, setExtrasOpen] = useState(
    Boolean(description || photos.length || supportingDocument),
  );
  const [attachmentMessage, setAttachmentMessage] = useState("");
  const documentCopy = supportingDocumentCopy(service);
  const updateItem = (id: string, patch: Partial<BookingCargoItem>) =>
    onChangeItems(
      items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  const addItem = () => {
    let nextId = items.length + 1;
    while (items.some((item) => item.id === `cargo-${nextId}`)) nextId += 1;
    onChangeItems([...items, { id: `cargo-${nextId}`, name: "", quantity: 1 }]);
  };
  const removeItem = (id: string) =>
    onChangeItems(
      items.length === 1
        ? [{ ...items[0], name: "", quantity: 1 }]
        : items.filter((item) => item.id !== id),
    );
  const choosePhoto = async (capture = false) => {
    const result = await (capture
      ? cameraService.capturePhoto()
      : fileService.pickImage());
    if (!result.ok) {
      setAttachmentMessage(result.reason === "cancelled" ? "" : result.message);
      return;
    }
    setAttachmentMessage("");
    onChangePhotos([
      ...photos,
      { ...result.value, id: `photo-${Date.now()}`, kind: "photo" },
    ]);
  };
  const chooseDocument = async () => {
    const result = await fileService.pickDocument();
    if (!result.ok) {
      setAttachmentMessage(result.reason === "cancelled" ? "" : result.message);
      return;
    }
    setAttachmentMessage("");
    onChangeSupportingDocument({
      ...result.value,
      id: `supporting-document-${Date.now()}`,
      kind: "supporting_document",
    });
  };
  return (
    <View style={styles.stack}>
      <View style={styles.items}>
        {items.map((item, index) => (
          <View key={item.id} style={styles.itemCard}>
            {items.length > 1 ? (
              <View style={styles.itemHeading}>
                <Text style={styles.itemTitle}>Cargo item {index + 1}</Text>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={`Remove cargo item ${index + 1}`}
                  onPress={() => removeItem(item.id)}
                  activeOpacity={0.74}
                  style={styles.remove}
                >
                  <AppIcon name="close" size={16} color={nwcColors.error} />
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <View style={styles.fields}>
              <View style={styles.nameField}>
                <TextInput
                  accessibilityLabel={`Cargo name ${index + 1}`}
                  value={item.name}
                  onChangeText={(name) => updateItem(item.id, { name })}
                  placeholder="Package description"
                  placeholderTextColor={nwcColors.tint91A0AE}
                  returnKeyType="next"
                  style={[styles.input, mobileInputStyles.text]}
                />
              </View>
              <View style={styles.quantityField}>
                <Text style={styles.label}>Qty</Text>
                <TextInput
                  accessibilityLabel={`Quantity for ${item.name || `cargo item ${index + 1}`}`}
                  value={String(item.quantity)}
                  onChangeText={(value) =>
                    updateItem(item.id, {
                      quantity: Math.max(1, Number(value) || 1),
                    })
                  }
                  placeholder="1"
                  placeholderTextColor={nwcColors.tint91A0AE}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  style={[
                    styles.input,
                    { flex: 1, paddingHorizontal: 6, textAlign: "center" },
                  ]}
                />
              </View>
            </View>
          </View>
        ))}
      </View>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Add another cargo item"
        onPress={addItem}
        activeOpacity={0.74}
        style={[styles.addItem, mobileInputStyles.text]}
      >
        <AppIcon name="plus" size={18} color={nwcColors.foreground} />
        <Text style={styles.addItemText}>Add another cargo item</Text>
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ expanded: extrasOpen }}
        onPress={() => setExtrasOpen((value) => !value)}
        style={styles.addItem}
      >
        <AppIcon
          name={extrasOpen ? "minus" : "plus"}
          size={18}
          color={nwcColors.foreground}
        />
        <Text style={styles.addItemText}>
          Photos, documents or notes (optional)
        </Text>
      </TouchableOpacity>
      {extrasOpen ? (
        <>
          <View style={styles.descriptionBlock}>
            <TextInput
              accessibilityLabel="Additional cargo description"
              value={description}
              onChangeText={onChangeDescription}
              placeholder="Additional package details (optional)"
              placeholderTextColor={nwcColors.tint91A0AE}
              multiline
              style={[styles.input, styles.multiline]}
            />
          </View>
          <AttachmentControl
            icon="image-outline"
            title="Add photos"
            detail="Optional images of the parcel or items"
            status={
              photos.length
                ? `${photos.length} photo${photos.length === 1 ? "" : "s"} added`
                : ""
            }
            actionLabel={photos.length ? "Add another" : "Choose photos"}
            onPress={() => choosePhoto()}
            onRemove={
              photos.length
                ? () => onChangePhotos(photos.slice(0, -1))
                : undefined
            }
          />
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Take cargo photo"
            onPress={() => choosePhoto(true)}
            style={styles.addItem}
          >
            <AppIcon name="camera" size={18} color={nwcColors.foreground} />
            <Text style={styles.addItemText}>Take a photo</Text>
          </TouchableOpacity>
          <AttachmentControl
            icon="file-document-outline"
            title={documentCopy.label}
            detail={documentCopy.description}
            status={supportingDocument?.name ?? ""}
            actionLabel={supportingDocument ? "Replace" : "Choose document"}
            onPress={chooseDocument}
            onRemove={
              supportingDocument
                ? () => onChangeSupportingDocument(undefined)
                : undefined
            }
          />
          {attachmentMessage ? (
            <Text
              accessibilityRole="alert"
              style={[styles.attachmentMessage, mobileInputStyles.text]}
            >
              {attachmentMessage}
            </Text>
          ) : null}
        </>
      ) : null}
    </View>
  );
}

function AttachmentControl({
  icon,
  title,
  detail,
  status,
  actionLabel,
  onPress,
  onRemove,
}: {
  icon: "image-outline" | "file-document-outline";
  title: string;
  detail: string;
  status: string;
  actionLabel: string;
  onPress: () => void | Promise<void>;
  onRemove?: () => void;
}) {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);
  return (
    <View style={styles.attachment}>
      <View style={styles.attachmentIcon}>
        <AppIcon name={icon} size={21} color={nwcColors.foreground} />
      </View>
      <View style={styles.attachmentCopy}>
        <Text style={styles.attachmentTitle}>{title}</Text>
        <Text style={styles.attachmentDetail}>{detail}</Text>
        {status ? <Text style={styles.attachmentStatus}>{status}</Text> : null}
      </View>
      <View style={styles.attachmentActions}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onPress}
          activeOpacity={0.74}
          style={styles.attachButton}
        >
          <Text style={styles.attachButtonText}>{actionLabel}</Text>
        </TouchableOpacity>
        {onRemove ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`Remove ${title}`}
            onPress={onRemove}
            activeOpacity={0.74}
            style={styles.removeAttachment}
          >
            <AppIcon name="close" size={15} color={nwcColors.error} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const createThemedStyles_styles = (nwcColors: NwcPalette) =>
  StyleSheet.create({
    stack: { gap: 14 },
    heading: { gap: 3 },
    title: {
      color: nwcColors.foreground,
      fontSize: 19,
      lineHeight: 25,
      fontFamily: "Poppins_600SemiBold",
    },
    detail: {
      color: nwcColors.muted,
      fontSize: 12,
      lineHeight: 17,
      fontFamily: "Poppins_500Medium",
    },
    items: { gap: 10 },
    itemCard: {
      gap: 12,
      padding: 14,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: nwcColors.border,
      backgroundColor: nwcColors.surface,
    },
    itemHeading: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    itemTitle: {
      color: nwcColors.foreground,
      fontSize: 13,
      lineHeight: 18,
      fontFamily: "Poppins_600SemiBold",
    },
    remove: {
      minHeight: 44,
      paddingHorizontal: 8,
      borderRadius: 11,
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      backgroundColor: nwcColors.surfaceRaised,
    },
    removeText: {
      color: nwcColors.error,
      fontSize: 10,
      lineHeight: 14,
      fontFamily: "Poppins_600SemiBold",
    },
    fields: { flexDirection: "row", gap: 9 },
    nameField: { flex: 1, gap: 5 },
    quantityField: {
      width: 105,
      gap: 6,
      flexDirection: "row",
      alignItems: "center",
    },
    label: {
      color: nwcColors.foreground,
      fontSize: 11,
      lineHeight: 15,
      fontFamily: "Poppins_600SemiBold",
    },
    optional: { color: nwcColors.muted, fontFamily: "Poppins_500Medium" },
    input: {
      minHeight: 49,
      paddingHorizontal: 12,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: nwcColors.border,
      backgroundColor: nwcColors.surfaceElevated,
      color: nwcColors.foreground,
      fontSize: 16,
      lineHeight: 22,
      fontFamily: "Poppins_600SemiBold",
    },
    addItem: {
      minHeight: 48,
      borderRadius: 16,
      paddingHorizontal: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      backgroundColor: nwcColors.surfaceRaised,
      borderWidth: 1,
      borderColor: nwcColors.border,
    },
    addItemText: {
      color: nwcColors.foreground,
      fontSize: 12,
      lineHeight: 17,
      fontFamily: "Poppins_600SemiBold",
    },
    descriptionBlock: { gap: 5 },
    multiline: { minHeight: 82, paddingTop: 12, textAlignVertical: "top" },
    attachment: {
      minHeight: 105,
      padding: 13,
      borderRadius: 21,
      borderWidth: 1,
      borderColor: nwcColors.border,
      backgroundColor: nwcColors.surfaceRaised,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
    },
    attachmentIcon: {
      width: 37,
      height: 37,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: nwcColors.surfaceNavyTint,
    },
    attachmentCopy: { flex: 1, gap: 2 },
    attachmentTitle: {
      color: nwcColors.foreground,
      fontSize: 12,
      lineHeight: 17,
      fontFamily: "Poppins_600SemiBold",
    },
    attachmentDetail: {
      color: nwcColors.muted,
      fontSize: 10,
      lineHeight: 14,
      fontFamily: "Poppins_500Medium",
    },
    attachmentStatus: {
      marginTop: 3,
      color: nwcColors.muted,
      fontSize: 10,
      lineHeight: 14,
      fontFamily: "Poppins_700Bold",
    },
    attachmentActions: { gap: 6, alignItems: "flex-end" },
    attachButton: {
      minHeight: 44,
      justifyContent: "center",
      paddingHorizontal: 9,
      borderRadius: 11,
      backgroundColor: nwcColors.surfaceElevated,
      borderWidth: 1,
      borderColor: nwcColors.border,
    },
    attachButtonText: {
      color: nwcColors.foreground,
      fontSize: 10,
      lineHeight: 14,
      fontFamily: "Poppins_600SemiBold",
    },
    removeAttachment: {
      width: 32,
      height: 28,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: nwcColors.surfaceRaised,
    },
    attachmentMessage: {
      color: nwcColors.error,
      fontSize: 11,
      lineHeight: 16,
      fontFamily: "Poppins_600SemiBold",
    },
  });
