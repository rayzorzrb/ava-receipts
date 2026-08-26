import SwiftUI

struct RootView: View {
    @EnvironmentObject private var store: AvaStore
    @State private var tab: Tab = .home
    @State private var showAdd = false
    @State private var selected: Receipt?
    @State private var category: AvaCategory?

    enum Tab { case home, boxes }

    var body: some View {
        ZStack(alignment: .bottom) {
            Color(red: 242/255, green: 242/255, blue: 247/255).ignoresSafeArea()

            Group {
                if let selected {
                    DetailView(receipt: selected) {
                        self.selected = nil
                    }
                } else if let category {
                    CategoryView(category: category, onBack: { self.category = nil }, onTap: { selected = $0 })
                } else if tab == .boxes {
                    BoxesView(onOpen: { category = $0 }, onTapSlip: { selected = $0 })
                } else {
                    HomeView(onOpen: { category = $0 }, onTapSlip: { selected = $0 })
                }
            }
            .padding(.bottom, 88)

            tabBar
        }
        .sheet(isPresented: $showAdd) {
            AddSheet { receipt in
                store.add(receipt)
                showAdd = false
            }
        }
    }

    private var tabBar: some View {
        HStack {
            tabButton(.home, label: "Home", system: "house.fill")
            Spacer(minLength: 0)
            Button {
                showAdd = true
            } label: {
                Image(systemName: "plus")
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundStyle(.white)
                    .frame(width: 48, height: 48)
                    .background(Color.accentColor)
                    .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                    .shadow(color: Color.accentColor.opacity(0.38), radius: 10, y: 4)
            }
            .accessibilityLabel("New receipt")
            Spacer(minLength: 0)
            tabButton(.boxes, label: "Boxes", system: "square.grid.2x2.fill")
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .frame(height: 64)
        .background(.ultraThinMaterial)
        .clipShape(Capsule(style: .continuous))
        .overlay(Capsule(style: .continuous).strokeBorder(Color.white.opacity(0.55), lineWidth: 0.5))
        .shadow(color: .black.opacity(0.16), radius: 20, y: 8)
        .padding(.horizontal, 12)
        .padding(.bottom, 10)
    }

    private func tabButton(_ t: Tab, label: String, system: String) -> some View {
        Button {
            selected = nil
            category = nil
            tab = t
        } label: {
            VStack(spacing: 2) {
                Image(systemName: system)
                    .font(.system(size: 20))
                Text(label)
                    .font(.system(size: 10))
            }
            .foregroundStyle(tab == t && selected == nil && category == nil ? Color(red: 0, green: 122/255, blue: 1) : Color(white: 0.56))
        }
        .buttonStyle(.plain)
    }
}

struct HomeView: View {
    @EnvironmentObject private var store: AvaStore
    var onOpen: (AvaCategory) -> Void
    var onTapSlip: (Receipt) -> Void

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 0) {
                HStack {
                    Text("ava")
                        .font(.system(size: 15, weight: .bold))
                        .padding(.horizontal, 12)
                        .frame(height: 36)
                        .background(Color.white)
                        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                        .shadow(color: .black.opacity(0.06), radius: 1, y: 1)
                    Spacer()
                }
                .padding(.horizontal, 16)
                .padding(.top, 8)

                VStack(alignment: .leading, spacing: 2) {
                    Text("august")
                        .font(.system(size: 40, weight: .bold))
                        .tracking(-1.4)
                    Text("\(store.receipts.count) receipts in the drawer")
                        .font(.system(size: 15))
                        .foregroundStyle(Color(white: 0.56))
                }
                .padding(.horizontal, 20)
                .padding(.top, 10)

                DrawerView(receipts: store.receipts, onTap: onTapSlip)
                    .padding(.horizontal, 8)
                    .padding(.top, 4)

                Text("the boxes")
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(Color(white: 0.56))
                    .padding(.horizontal, 20)
                    .padding(.top, 18)

                LazyVGrid(columns: [GridItem(.flexible(), spacing: 12), GridItem(.flexible(), spacing: 12)], spacing: 16) {
                    ForEach(AvaCategory.allCases.filter { $0 != .other }) { cat in
                        Button { onOpen(cat) } label: {
                            VStack(alignment: .leading, spacing: 6) {
                                DrawerView(receipts: Array(store.inCategory(cat).prefix(3)), onTap: onTapSlip)
                                Text(cat.label.uppercased())
                                    .font(.system(size: 11, weight: .regular, design: .monospaced))
                                    .tracking(0.4)
                                    .foregroundStyle(.black)
                                Text(String(format: "₹%.2f ×%d", store.total(cat), store.inCategory(cat).count))
                                    .font(.system(size: 12, design: .monospaced))
                                    .foregroundStyle(Color(white: 0.56))
                            }
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 24)
            }
        }
    }
}

struct BoxesView: View {
    @EnvironmentObject private var store: AvaStore
    var onOpen: (AvaCategory) -> Void
    var onTapSlip: (Receipt) -> Void

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 8) {
                Text("the boxes")
                    .font(.system(size: 34, weight: .bold))
                    .padding(.horizontal, 20)
                    .padding(.top, 12)
                Text("four piles, same oak")
                    .font(.system(size: 15))
                    .foregroundStyle(Color(white: 0.56))
                    .padding(.horizontal, 20)

                LazyVGrid(columns: [GridItem(.flexible(), spacing: 12), GridItem(.flexible(), spacing: 12)], spacing: 16) {
                    ForEach(AvaCategory.allCases.filter { $0 != .other }) { cat in
                        Button { onOpen(cat) } label: {
                            VStack(alignment: .leading, spacing: 6) {
                                DrawerView(receipts: Array(store.inCategory(cat).prefix(3)), onTap: onTapSlip)
                                Text(cat.label.uppercased())
                                    .font(.system(size: 11, design: .monospaced))
                                    .foregroundStyle(.black)
                                Text(String(format: "₹%.2f ×%d", store.total(cat), store.inCategory(cat).count))
                                    .font(.system(size: 12, design: .monospaced))
                                    .foregroundStyle(Color(white: 0.56))
                            }
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(20)
            }
        }
    }
}

struct CategoryView: View {
    @EnvironmentObject private var store: AvaStore
    let category: AvaCategory
    var onBack: () -> Void
    var onTap: (Receipt) -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Button("‹ August", action: onBack)
                .font(.system(size: 17))
                .foregroundStyle(Color(red: 0, green: 122/255, blue: 1))
                .padding(.horizontal, 16)
                .padding(.top, 8)

            Text(category.label.lowercased())
                .font(.system(size: 34, weight: .bold))
                .padding(.horizontal, 20)
                .padding(.top, 4)
            Text(String(format: "₹%.2f · %d receipts", store.total(category), store.inCategory(category).count))
                .font(.system(size: 15))
                .foregroundStyle(Color(white: 0.56))
                .padding(.horizontal, 20)
                .padding(.bottom, 8)

            DrawerView(receipts: store.inCategory(category), onTap: onTap)
                .padding(.horizontal, 8)
            Spacer()
        }
    }
}

struct DetailView: View {
    let receipt: Receipt
    var onBack: () -> Void

    var body: some View {
        VStack {
            HStack {
                Button("‹ August", action: onBack)
                Spacer()
                Button("Done", action: onBack)
            }
            .font(.system(size: 17))
            .foregroundStyle(Color(red: 0, green: 122/255, blue: 1))
            .padding(.horizontal, 16)
            .padding(.top, 8)

            Spacer()
            Image(receipt.imageName)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(maxWidth: 280)
                .shadow(color: .black.opacity(0.18), radius: 16, y: 10)
            Spacer()
        }
    }
}

struct AddSheet: View {
    @Environment(\.dismiss) private var dismiss
    var onSave: (Receipt) -> Void

    @State private var merchant = ""
    @State private var cents = 0
    @State private var category: AvaCategory = .groceries

    private let merchants = ["Ottimo Pizza", "Trader Joe's", "Blue Bottle", "Uber", "IKEA", "Whole Foods"]
    private let images = [
        "Ottimo Pizza": "SlipOttimo",
        "Trader Joe's": "SlipTJ",
        "Blue Bottle": "SlipBlueBottle",
        "Uber": "SlipUber",
        "IKEA": "SlipIkea",
        "Whole Foods": "SlipWF",
    ]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text("Merchant")
                        .font(.system(size: 13))
                        .foregroundStyle(.secondary)
                    FlowChips(items: merchants, selected: $merchant)

                    Text("Amount")
                        .font(.system(size: 13))
                        .foregroundStyle(.secondary)
                    Text(String(format: "₹%.2f", Double(cents) / 100))
                        .font(.system(size: 40, weight: .semibold))
                        .tracking(-1.5)

                    LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 8), count: 3), spacing: 8) {
                        ForEach(["1","2","3","4","5","6","7","8","9",".","0","⌫"], id: \.self) { key in
                            Button {
                                tap(key)
                            } label: {
                                Text(key)
                                    .font(.system(size: 22, weight: .medium))
                                    .frame(maxWidth: .infinity, minHeight: 46)
                                    .background(Color.white)
                                    .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                            }
                            .buttonStyle(.plain)
                        }
                    }

                    Text("Which box")
                        .font(.system(size: 13))
                        .foregroundStyle(.secondary)
                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                        ForEach(AvaCategory.allCases.filter { $0 != .other }) { cat in
                            Button { category = cat } label: {
                                Image("HisTray")
                                    .resizable()
                                    .aspectRatio(contentMode: .fit)
                                    .overlay(alignment: .bottom) {
                                        Text(cat.label)
                                            .font(.system(size: 11, design: .monospaced))
                                            .padding(6)
                                            .frame(maxWidth: .infinity)
                                            .background(.ultraThinMaterial)
                                    }
                                    .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
                                    .overlay {
                                        RoundedRectangle(cornerRadius: 8)
                                            .stroke(category == cat ? Color.black : Color.clear, lineWidth: 2)
                                    }
                            }
                            .buttonStyle(.plain)
                        }
                    }

                    Button {
                        let rec = Receipt(
                            id: "n\(Int(Date().timeIntervalSince1970))",
                            merchant: merchant.isEmpty ? "New merchant" : merchant,
                            date: "26 AUG",
                            amount: Double(cents) / 100,
                            category: category,
                            imageName: images[merchant] ?? "SlipOttimo",
                            pos: .init(x: 0.48, y: 0.52, rotation: 5, width: 0.20)
                        )
                        onSave(rec)
                    } label: {
                        Text("Print into the drawer")
                            .font(.system(size: 17, weight: .semibold))
                            .foregroundStyle(.white)
                            .frame(maxWidth: .infinity, minHeight: 50)
                            .background(Color.black)
                            .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                    }
                    .padding(.top, 8)
                }
                .padding(16)
            }
            .background(Color(red: 242/255, green: 242/255, blue: 247/255))
            .navigationTitle("New receipt")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
        .presentationDetents([.large])
    }

    private func tap(_ key: String) {
        if key == "⌫" { cents /= 10 }
        else if key == "." { return }
        else if let d = Int(key), cents < 1_000_000 { cents = cents * 10 + d }
    }
}

private struct FlowChips: View {
    let items: [String]
    @Binding var selected: String
    var body: some View {
        FlexibleView(data: items) { item in
            Button {
                selected = item
            } label: {
                Text(item == "Trader Joe's" ? "Trader Joe’s" : item.replacingOccurrences(of: " Pizza", with: ""))
                    .font(.system(size: 14))
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(selected == item ? Color.black : Color.white)
                    .foregroundStyle(selected == item ? Color.white : Color.black)
                    .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
            }
            .buttonStyle(.plain)
        }
    }
}

private struct FlexibleView<Data: RandomAccessCollection, Content: View>: View where Data.Element: Hashable {
    let data: Data
    let content: (Data.Element) -> Content
    var body: some View {
        var width: CGFloat = 0
        var height: CGFloat = 0
        return GeometryReader { geo in
            ZStack(alignment: .topLeading) {
                ForEach(Array(data), id: \.self) { item in
                    content(item)
                        .padding(4)
                        .alignmentGuide(.leading) { d in
                            if abs(width - d.width) > geo.size.width { width = 0; height -= d.height }
                            let result = width
                            if item == data.last { width = 0 } else { width -= d.width }
                            return result
                        }
                        .alignmentGuide(.top) { _ in
                            let result = height
                            if item == data.last { height = 0 }
                            return result
                        }
                }
            }
        }
        .frame(minHeight: 80)
    }
}
