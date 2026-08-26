import SwiftUI

enum AvaCategory: String, CaseIterable, Identifiable, Codable {
    case groceries, coffee, rides, home, other
    var id: String { rawValue }
    var label: String {
        switch self {
        case .groceries: return "Groceries"
        case .coffee: return "Coffee"
        case .rides: return "Rides"
        case .home: return "Home"
        case .other: return "August"
        }
    }
}

struct SlipPos: Codable, Hashable {
    var x: CGFloat
    var y: CGFloat
    var rotation: Double
    var width: CGFloat
}

struct Receipt: Identifiable, Codable, Hashable {
    var id: String
    var merchant: String
    var date: String
    var amount: Double
    var category: AvaCategory
    var imageName: String
    var pos: SlipPos
}

@MainActor
final class AvaStore: ObservableObject {
    @Published var receipts: [Receipt]
    private let key = "ava-v3-ios"

    init() {
        if let data = UserDefaults.standard.data(forKey: key),
           let extra = try? JSONDecoder().decode([Receipt].self, from: data) {
            receipts = Self.seed + extra
        } else {
            receipts = Self.seed
        }
    }

    var extras: [Receipt] {
        receipts.filter { $0.id.hasPrefix("n") }
    }

    func saveExtras() {
        let extra = extras
        if let data = try? JSONEncoder().encode(extra) {
            UserDefaults.standard.set(data, forKey: key)
        }
    }

    func add(_ receipt: Receipt) {
        receipts.append(receipt)
        saveExtras()
    }

    func inCategory(_ cat: AvaCategory) -> [Receipt] {
        receipts.filter { $0.category == cat }
    }

    func total(_ cat: AvaCategory) -> Double {
        inCategory(cat).reduce(0) { $0 + $1.amount }
    }

    static let seed: [Receipt] = [
        .init(id: "ottimo", merchant: "Ottimo Pizza", date: "18 AUG", amount: 54.30, category: .other, imageName: "SlipOttimo",
              pos: .init(x: 0.34, y: 0.46, rotation: -14, width: 0.21)),
        .init(id: "tj", merchant: "Trader Joe's", date: "11 AUG", amount: 32.15, category: .groceries, imageName: "SlipTJ",
              pos: .init(x: 0.52, y: 0.47, rotation: 9, width: 0.20)),
        .init(id: "bluebottle", merchant: "Blue Bottle", date: "12 AUG", amount: 6.50, category: .coffee, imageName: "SlipBlueBottle",
              pos: .init(x: 0.68, y: 0.44, rotation: -6, width: 0.19)),
        .init(id: "wf", merchant: "Whole Foods", date: "03 AUG", amount: 42.16, category: .groceries, imageName: "SlipWF",
              pos: .init(x: 0.33, y: 0.56, rotation: 7, width: 0.21)),
        .init(id: "uber", merchant: "Uber", date: "15 AUG", amount: 18.40, category: .rides, imageName: "SlipUber",
              pos: .init(x: 0.50, y: 0.58, rotation: -11, width: 0.20)),
        .init(id: "ikea", merchant: "IKEA", date: "22 AUG", amount: 89.00, category: .home, imageName: "SlipIkea",
              pos: .init(x: 0.68, y: 0.56, rotation: 12, width: 0.19)),
        .init(id: "chipotle", merchant: "Chipotle", date: "20 AUG", amount: 14.85, category: .other, imageName: "SlipOttimo",
              pos: .init(x: 0.42, y: 0.50, rotation: 4, width: 0.19)),
        .init(id: "starbucks", merchant: "Starbucks", date: "08 AUG", amount: 5.75, category: .coffee, imageName: "SlipBlueBottle",
              pos: .init(x: 0.61, y: 0.52, rotation: -18, width: 0.18)),
        .init(id: "philz", merchant: "Philz", date: "05 AUG", amount: 7.65, category: .coffee, imageName: "SlipBlueBottle",
              pos: .init(x: 0.38, y: 0.62, rotation: 15, width: 0.19)),
        .init(id: "amc", merchant: "AMC", date: "16 AUG", amount: 24.00, category: .other, imageName: "SlipUber",
              pos: .init(x: 0.57, y: 0.48, rotation: 16, width: 0.18)),
        .init(id: "shell", merchant: "Shell", date: "09 AUG", amount: 45.20, category: .other, imageName: "SlipIkea",
              pos: .init(x: 0.58, y: 0.64, rotation: -5, width: 0.20)),
        .init(id: "sushiran", merchant: "Sushi Ran", date: "25 AUG", amount: 68.00, category: .other, imageName: "SlipWF",
              pos: .init(x: 0.73, y: 0.60, rotation: 8, width: 0.18)),
        .init(id: "yakuza", merchant: "Yakuza", date: "14 AUG", amount: 38.50, category: .other, imageName: "SlipOttimo",
              pos: .init(x: 0.75, y: 0.52, rotation: -12, width: 0.18)),
    ]
}
